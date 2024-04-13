import { ImageMime } from "./types";

const mimeToExtension: Map<ImageMime, string> = new Map([
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
  ["image/jpeg", "jpg"],
]);

/** typescript guard to check if a string is a valid mimetype */
export function isImageMimeType(str: string): str is ImageMime {
  return mimeToExtension.has(str as ImageMime);
}

/**
 * get the image mime type of a url
 *
 * Throws an Error is if extension doesn't correspond to an {@link ImageMime}.
 */
export function getImageMimeType(href: string): ImageMime {
  const [src] = href.toLowerCase().split("?", 1);

  if (src.endsWith(".png")) {
    return "image/png";
  } else if (src.endsWith(".gif")) {
    return "image/gif";
  } else if (src.endsWith(".svg")) {
    return "image/svg+xml";
  } else if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
    return "image/jpeg";
  } else {
    throw new Error(`can't convert '${href}' to a mime type`);
  }
}

/** get the extension for a given mim type */
export function getImageMimeExtension(mime: ImageMime): string {
  const extension = mimeToExtension.get(mime);
  if (extension) {
    return extension;
  } else {
    throw new Error(`got invalid mime type: ${mime}`);
  }
}
