import { ComponentChildren } from "preact";
import "preact/src/jsx";

/** all valid image mime types for epub */
type ImageMime = `image/${"png" | "jpeg" | "gif" | "svg+xml"}`;

type Mime =
  | ImageMime
  | `application/${"xhtml+xml" | "x-dtbncx+xml" | "oebps-package+xml"}`
  | "text/css";

/** A valid iso two letter language code */
type LangCode =
  | "ab"
  | "aa"
  | "af"
  | "ak"
  | "sq"
  | "am"
  | "ar"
  | "an"
  | "hy"
  | "as"
  | "av"
  | "ae"
  | "ay"
  | "az"
  | "bm"
  | "ba"
  | "eu"
  | "be"
  | "bn"
  | "bi"
  | "bs"
  | "br"
  | "bg"
  | "my"
  | "ca"
  | "ch"
  | "ce"
  | "ny"
  | "zh"
  | "cu"
  | "cv"
  | "kw"
  | "co"
  | "cr"
  | "hr"
  | "cs"
  | "da"
  | "dv"
  | "nl"
  | "dz"
  | "en"
  | "eo"
  | "et"
  | "ee"
  | "fo"
  | "fj"
  | "fi"
  | "fr"
  | "fy"
  | "ff"
  | "gd"
  | "gl"
  | "lg"
  | "ka"
  | "de"
  | "el"
  | "kl"
  | "gn"
  | "gu"
  | "ht"
  | "ha"
  | "he"
  | "hz"
  | "hi"
  | "ho"
  | "hu"
  | "is"
  | "io"
  | "ig"
  | "id"
  | "ia"
  | "ie"
  | "iu"
  | "ik"
  | "ga"
  | "it"
  | "ja"
  | "jv"
  | "kn"
  | "kr"
  | "ks"
  | "kk"
  | "km"
  | "ki"
  | "rw"
  | "ky"
  | "kv"
  | "kg"
  | "ko"
  | "kj"
  | "ku"
  | "lo"
  | "la"
  | "lv"
  | "li"
  | "ln"
  | "lt"
  | "lu"
  | "lb"
  | "mk"
  | "mg"
  | "ms"
  | "ml"
  | "mt"
  | "gv"
  | "mi"
  | "mr"
  | "mh"
  | "mn"
  | "na"
  | "nv"
  | "nd"
  | "nr"
  | "ng"
  | "ne"
  | "no"
  | "nb"
  | "nn"
  | "ii"
  | "oc"
  | "oj"
  | "or"
  | "om"
  | "os"
  | "pi"
  | "ps"
  | "fa"
  | "pl"
  | "pt"
  | "pa"
  | "qu"
  | "ro"
  | "rm"
  | "rn"
  | "ru"
  | "se"
  | "sm"
  | "sg"
  | "sa"
  | "sc"
  | "sr"
  | "sn"
  | "sd"
  | "si"
  | "sk"
  | "sl"
  | "so"
  | "st"
  | "es"
  | "su"
  | "sw"
  | "ss"
  | "sv"
  | "tl"
  | "ty"
  | "tg"
  | "ta"
  | "tt"
  | "te"
  | "th"
  | "bo"
  | "ti"
  | "to"
  | "ts"
  | "tn"
  | "tr"
  | "tk"
  | "tw"
  | "ug"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "vo"
  | "wa"
  | "cy"
  | "wo"
  | "xh"
  | "yi"
  | "yo"
  | "za"
  | "zu";

// override xml intrinsic elements
declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface HTMLAttributes {
      xmlns?: string;
      "xml:lang"?: string;
    }

    interface IntrinsicElements {
      ncx: {
        children: ComponentChildren;
        xmlns: string;
        "xml:lang": LangCode;
        version: string;
      };
      navMap: { children: ComponentChildren };
      navPoint: { children: ComponentChildren; id: string; playOrder: string };
      navLabel: { children: ComponentChildren };
      content: { src: string };
      docAuthor: { children: ComponentChildren };
      docTitle: { children: ComponentChildren };
      guide: { children?: ComponentChildren };
      spine: { children?: ComponentChildren; toc?: string };
      manifest: { children: ComponentChildren };
      metadata: { children: ComponentChildren; "xmlns:dc": string };
      container: {
        children: ComponentChildren;
        xmlns: string;
        version: string;
      };
      package: {
        children: ComponentChildren;
        xmlns: string;
        "xmlns:opf": string;
        version: string;
      };
      item: { id: string; href: string; "media-type": Mime };
      itemref: { idref: string };
      rootfile: { "full-path": string; "media-type": Mime };
      rootfiles: { children: ComponentChildren };
      "dc:creator": { children: string };
      "dc:language": { children: LangCode };
      "dc:title": { children: string };
      "dc:publisher": { children: string };
      "dc:description": { children: string };
      "dc:subject": { children: string };
      "dc:rights": { children: string };
      "dc:identifier": { children: string; id?: string };
    }
  }
}
