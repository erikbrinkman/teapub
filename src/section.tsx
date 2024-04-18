import { DefaultTreeAdapterMap, parseFragment } from "parse5";
import { ComponentChild, VNode, h } from "preact";
import { renderToXml, xmlHeader } from "./utils";

type Node = DefaultTreeAdapterMap["node"];

/**
 * how to handle missing images
 *
 * A missing image is an `<img />` in sections whose `src` attribute isn't a
 * key in `remapping`.
 * - `"error"` : throws and error
 * - `"ignore"` : do nothing, keep the `<img />` element
 * - `"remove"` : filter the `<img />` element
 */
export type MissingImage = "error" | "ignore" | "remove";

interface Props {
  title: string;
  content: string;
  remapping: Map<string, string>;
  missingImage: MissingImage;
  cssFile?: string;
}

const xhtmlHeader = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">`;
/* eslint-disable spellcheck/spell-checker */
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
  "bar",
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
  "img",
  "map",
  "noscript",
  "svg",
  "object",
  "table",
  "tt",
  "var",
]);
/* eslint-enable spellcheck/spell-checker */

class Converter {
  constructor(
    private remapping: Map<string, string>,
    private missingImage: MissingImage,
  ) {}

  /** convert node-html-parser node to preact vnode */
  convert(node: Node, inSvg: boolean): ComponentChild {
    if ("tagName" in node) {
      // element : process it and children
      // this silly trick is necessary to remove Elements first because the
      // default typings don't fit a proper discriminant union

      // don't modify svgs as we assume everything is valid
      const isSvg = inSvg || node.nodeName === "svg";
      const attributes = Object.fromEntries(
        node.attrs
          .filter(({ name }) => isSvg || allowedAttributes.has(name))
          .map(({ name, value }) => [name, value]),
      );

      // remap images and frames
      if (node.nodeName === "img") {
        const src = this.remapping.get(decodeURIComponent(attributes.src));
        if (src !== undefined) {
          attributes.src = src;
        } else if (this.missingImage === "error") {
          throw new Error(
            `img src '${attributes.src}' wasn't in remapped items`,
          );
        } else if (this.missingImage === "remove") {
          return null;
        }
      } else if (node.nodeName === "iframe") {
        const src = this.remapping.get(decodeURIComponent(attributes.src));
        if (src !== undefined) {
          attributes.src = src;
        } else if (this.missingImage === "error") {
          throw new Error(
            `iframe src '${attributes.src}' wasn't in remapped items`,
          );
        } else if (this.missingImage === "remove") {
          return null;
        }
      }

      const children = node.childNodes.map((child) =>
        this.convert(child, isSvg),
      );
      if (!isSvg && !allowedTags.has(node.nodeName.toLowerCase())) {
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
        this.convert(child, inSvg),
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
  remapping,
  missingImage,
  cssFile,
}: Props): VNode {
  const vnodes = convert(parseFragment(content), remapping, { missingImage });
  const cssHeader = cssFile ? (
    <link type="text/css" rel="stylesheet" href={cssFile} />
  ) : null;
  return (
    <html xmlns="http://www.w3.org/1999/xhtml" xmlLang="en">
      <head>
        {/* eslint-disable spellcheck/spell-checker */}
        <meta
          http-equiv="Content-Type"
          content="application/xhtml+xml; charset=utf-8"
        />
        {/* eslint-enable spellcheck/spell-checker */}
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
