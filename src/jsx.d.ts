import { ComponentChildren } from "preact";
import "preact/src/jsx";

// override xml intrinsic elements
// eslint-disable-next-line spellcheck/spell-checker
declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface HTMLAttributes {
      xmlns?: string;
      xmlLang?: string;
    }

    interface IntrinsicElements {
      ncx: {
        children: ComponentChildren;
        xmlns: string;
        xmlLang: LangCode;
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
      container: {
        children: ComponentChildren;
        xmlns: string;
        version: string;
      };
      package: {
        children: ComponentChildren;
        xmlns: string;
        xmlnsOpf: string;
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
