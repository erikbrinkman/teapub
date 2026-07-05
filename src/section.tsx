import leven from "leven";
import { type DefaultTreeAdapterMap, parseFragment } from "parse5";
import { type ComponentChild, h, type VNode } from "preact";
import type { LangCode } from "./types.js";
import { renderToXml, xmlHeader } from "./utils.js";

type Node = DefaultTreeAdapterMap["node"];

/**
 * how to handle missing images
 *
 * A missing image is an `<img />` in sections whose `src` attribute isn't a
 * key in `remapping`.
 * - `"error"` : throws and error
 * - `"warn"` : logs a warning with information about the missing image
 * - `"ignore"` : do nothing, keep the `<img />` element
 * - `"remove"` : filter the `<img />` element
 */
export type MissingImage = "error" | "warn" | "ignore" | "remove";

interface Props {
  title: string;
  content: string;
  /** the document language, mirrored onto the root `<html>` element */
  lang?: LangCode;
  remapping: Map<string, string>;
  missingImage: MissingImage;
  cssFile?: string;
}

const xhtmlHeader = `<!DOCTYPE html>`;
const allowedAttributes = new Set([
  "content",
  "alt",
  "id",
  "title",
  "src",
  "href",
  "about",
  "accesskey",
  "class",
  "content",
  "contenteditable",
  "contextmenu",
  "datatype",
  "dir",
  "draggable",
  "dropzone",
  "hidden",
  "hreflang",
  "id",
  "inlist",
  "itemid",
  "itemref",
  "itemscope",
  "itemtype",
  "lang",
  "media",
  "prefix",
  "property",
  "rel",
  "resource",
  "rev",
  "role",
  "spellcheck",
  "style",
  "tabindex",
  "target",
  "title",
  "type",
  "typeof",
  "vocab",
  "colspan",
  "rowspan",
]);
const allowedTags = new Set([
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "address",
  "hr",
  "pre",
  "blockquote",
  "center",
  "ins",
  "del",
  "a",
  "span",
  "bdo",
  "br",
  "em",
  "strong",
  "dfn",
  "code",
  "samp",
  "kbd",
  "cite",
  "abbr",
  "acronym",
  "q",
  "sub",
  "sup",
  "tt",
  "i",
  "b",
  "big",
  "small",
  "u",
  "s",
  "strike",
  "basefont",
  "font",
  "object",
  "param",
  "img",
  "table",
  "caption",
  "colgroup",
  "col",
  "thead",
  "tfoot",
  "tbody",
  "tr",
  "th",
  "td",
  "embed",
  "applet",
  "iframe",
  "map",
  "noscript",
  "svg",
  "var",
]);

/** decode a percent-encoded src, tolerating malformed encoding and absence */
function decodeSrc(src: string | undefined): string {
  // an absent src normalizes to "" so it flows through the missingImage policy
  // rather than being coerced to the literal string "undefined"
  if (src === undefined) return "";
  try {
    return decodeURIComponent(src);
  } catch {
    // malformed percent-encoding (e.g. a bare `%`) — use the literal value
    return src;
  }
}

function findClosest(
  haystack: Iterable<string>,
  needle: string,
): string | undefined {
  let closest: string | undefined;
  let cdist = 2;
  for (const potential of haystack) {
    const dist =
      leven(potential, needle) / Math.max(potential.length, needle.length);
    if (dist < cdist) {
      cdist = dist;
      closest = potential;
    }
  }
  return closest;
}

class Converter {
  constructor(
    private remapping: Map<string, string>,
    private missingImage: MissingImage,
  ) {}

  /**
   * remap an img/iframe `src` to its packaged href in place
   *
   * @returns `false` when the element should be dropped (`missingImage: "remove"`)
   */
  private remapSrc(
    kind: "img" | "iframe",
    attributes: Record<string, string>,
  ): boolean {
    const searchSrc = decodeSrc(attributes.src);
    const src = this.remapping.get(searchSrc);
    if (src !== undefined) {
      attributes.src = src;
    } else if (this.missingImage === "error") {
      throw new Error(`${kind} src '${searchSrc}' wasn't in remapped items`);
    } else if (this.missingImage === "warn") {
      const closest = findClosest(this.remapping.keys(), searchSrc);
      const suffix = closest
        ? `the closest match was '${closest}'`
        : "there were no remapped items";
      console.warn(
        `${kind} src '${searchSrc}' wasn't in remapped items; ${suffix}`,
      );
    } else if (this.missingImage === "remove") {
      return false;
    }
    return true;
  }

  /** convert node-html-parser node to preact vnode */
  convert(node: Node, inForeign: boolean): ComponentChild {
    if ("tagName" in node) {
      // element : process it and children
      // this silly trick is necessary to remove Elements first because the
      // default typings don't fit a proper discriminant union

      // don't modify foreign content (svg, mathml) as we assume everything is valid
      const isForeign =
        inForeign || node.nodeName === "svg" || node.nodeName === "math";
      const attributes = Object.fromEntries(
        node.attrs
          .filter(({ name }) => isForeign || allowedAttributes.has(name))
          .map(({ name, value }) => [name, value]),
      );

      // remap images and frames
      if (node.nodeName === "img" || node.nodeName === "iframe") {
        if (!this.remapSrc(node.nodeName, attributes)) {
          // missingImage === "remove"
          return null;
        }
      }

      const children = node.childNodes.map((child) =>
        this.convert(child, isForeign),
      );
      if (!isForeign && !allowedTags.has(node.nodeName.toLowerCase())) {
        // remove node but keep children
        return <>{children}</>;
      } else {
        return h(node.nodeName.toLowerCase(), attributes, children);
      }
    } else if (
      node.nodeName === "#comment" ||
      node.nodeName === "#documentType"
    ) {
      // comment or document type : ignore
      return null;
    } else if (node.nodeName === "#text") {
      // text : preserve
      return node.value;
    } else {
      // doc or fragment : iterate over children
      const children = node.childNodes.map((child) =>
        this.convert(child, inForeign),
      );
      return <>{children}</>;
    }
  }
}

/** convert node-html-parser node to preact vnode */
export function convert(
  node: Node,
  remapping: Map<string, string>,
  { missingImage }: { missingImage: MissingImage },
): ComponentChild {
  return new Converter(remapping, missingImage).convert(node, false);
}

function Section({
  title,
  content,
  lang = "en",
  remapping,
  missingImage,
  cssFile,
}: Props): VNode {
  const vnodes = convert(parseFragment(content), remapping, { missingImage });
  const cssHeader = cssFile ? (
    <link type="text/css" rel="stylesheet" href={cssFile} />
  ) : null;
  return (
    <html xmlns="http://www.w3.org/1999/xhtml" xmlLang={lang} lang={lang}>
      <head>
        <meta
          http-equiv="Content-Type"
          content="application/xhtml+xml; charset=utf-8"
        />
        {cssHeader}
        <title>{title}</title>
      </head>
      <body>{vnodes}</body>
    </html>
  );
}

export function section(props: Props): string {
  return `${xmlHeader}${xhtmlHeader}${renderToXml(<Section {...props} />)}`;
}
