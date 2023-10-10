/**
 * A library for rendering epub files
 *
 * The entry point is the {@link render} function, which takes an object iog
 * {@link RenderOptions}.
 *
 * @packageDocumentation
 */
import JsZip from "jszip";
import { v4 as uuid4 } from "uuid";
import { containerXml } from "./container";
import { contentOpf, ManifestContent } from "./content";
import {
  getImageMimeExtension,
  getImageMimeType,
  isImageMimeType,
} from "./image-mime";
import { MissingImage, section } from "./section";
import { SectionInfo, tocNcx } from "./toc";
import { ImageMime, LangCode } from "./types";
export { getImageMimeExtension, getImageMimeType, isImageMimeType };
export type { ImageMime, LangCode, MissingImage };

/**
 * An image to include in the epub
 */
export interface ImageData {
  /** an appropriately formatted buffer of the image */
  readonly data: Uint8Array;
  /**
   * the image mime type
   *
   * If omitted it will try to be inferred from the extension.
   */
  readonly mime?: ImageMime | undefined;
}

/**
 * A section (chapter) of data in an epub
 */
export interface Section {
  /**
   * An html string of the content for this section
   *
   * Illegal tags and attributes will be removed. Images will be looked up in
   * the images mapping.
   */
  readonly content: string;
  /** The title of the section to be included in the table of contents */
  readonly title: string;
}

/** all options for epub rendering */
export interface RenderOptions {
  /** the title */
  title: string;
  /** the author */
  author?: string | undefined;
  /** the publisher */
  publisher?: string | undefined;
  /** a copyright statement for the epub */
  copyright?: string | undefined;
  /** a set of subject tags */
  subjects?: readonly string[] | undefined;
  /** an extra description */
  description?: string | undefined;
  /**
   * a unique id for the epub
   *
   * If omitted, one will be generated with uuid v4.
   */
  uid?: string | undefined;
  /** the two letter language code (default: "en") */
  lang?: LangCode | undefined;
  /** the content of the epub */
  sections: readonly Section[];
  /**
   * images to include in the epub
   *
   * If an `img` tag appears in sections, its `src` attribute must be present
   * in this map.
   */
  images?: Map<string, ImageData> | undefined;
  /**
   * iframes to include in the epub
   *
   * If an `iframe` tag appears in sections, its `src` attribute must be present
   * in this map. The value must be an xhtml frame document, unlike sections,
   * this will not be converted to valid xhtml.
   */
  frames?: Map<string, string> | undefined;
  /** custom global css to apply */
  css?: string;
  /** how to handle missing images and iframes */
  missingImage?: MissingImage;
}

/**
 * Render an epub from input content
 *
 * @returns a buffer of the generated epub
 */
export async function render({
  title,
  author,
  publisher,
  copyright,
  subjects,
  description,
  uid = uuid4(),
  lang = "en",
  sections,
  images = new Map(),
  frames = new Map(),
  css,
  missingImage = "error",
}: RenderOptions): Promise<Uint8Array> {
  // create zip and write structural files
  const zip = new JsZip();
  zip.file("mimetype", "application/epub+zip");
  const metaInf = zip.folder("META-INF")!;
  metaInf.file("container.xml", containerXml());
  const oebps = zip.folder("OEBPS")!;
  const manifestItems: ManifestContent[] = [];
  const tocItems: SectionInfo[] = [];
  const remapping = new Map<string, string>();

  // add images
  {
    let i = 0;
    for (const [src, { data, mime }] of images) {
      const id = `img_${i++}`;
      const mediaType = mime ?? getImageMimeType(src);
      const ext = getImageMimeExtension(mediaType);
      const href = `images/${id}.${ext}`;
      oebps.file(href, data, { binary: true });
      remapping.set(src, href);
      manifestItems.push({
        id,
        href,
        mediaType,
        spine: false,
      });
    }
  }

  // add frames
  {
    let i = 0;
    for (const [src, content] of frames) {
      const id = `frame_${i++}.xhtml`;
      const mediaType = "text/html";
      const href = `frames/${id}.html`;
      oebps.file(href, content);
      remapping.set(src, href);
      manifestItems.push({
        id,
        href,
        mediaType,
        spine: false,
      });
    }
  }

  // add css
  let cssFile;
  if (css) {
    cssFile = "style.css";
    oebps.file(cssFile, css);
    manifestItems.push({
      id: "css",
      href: cssFile,
      mediaType: "text/css",
      spine: false,
    });
  }

  // add sections
  for (const [i, sect] of sections.entries()) {
    const id = `section_${i}`;
    const href = `${id}.xhtml`;
    const { title } = sect;
    oebps.file(href, section({ ...sect, remapping, missingImage, cssFile }));
    manifestItems.push({
      id,
      href,
      mediaType: "application/xhtml+xml",
      spine: true,
    });
    tocItems.push({ id, title, href });
  }

  // add toc
  const tocFilename = "toc.ncx";
  oebps.file(tocFilename, tocNcx({ uid, title, author, sections: tocItems }));
  manifestItems.push({
    id: "toc",
    href: tocFilename,
    mediaType: "application/x-dtbncx+xml",
    spine: false,
  });

  // add manifest
  oebps.file(
    "content.opf",
    contentOpf({
      title,
      author,
      publisher,
      copyright,
      subjects,
      description,
      lang,
      uid,
      content: manifestItems,
    }),
  );
  return await zip.generateAsync({ type: "uint8array" });
}
