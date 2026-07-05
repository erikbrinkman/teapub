import type { VNode } from "preact";
import type { LangCode } from "./types.js";
import { renderToXml, xmlHeader } from "./utils.js";

const xhtmlHeader = `<!DOCTYPE html>`;

export interface NavItem {
  href: string;
  title: string;
}

interface Props {
  title: string;
  lang?: LangCode;
  sections: readonly NavItem[];
}

function Nav({ title, lang = "en", sections }: Props): VNode {
  const items = sections.map(({ href, title: sectionTitle }) => (
    <li>
      <a href={href}>{sectionTitle}</a>
    </li>
  ));
  return (
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlnsEpub="http://www.idpf.org/2007/ops"
      xmlLang={lang}
      lang={lang}
    >
      <head>
        <title>{title}</title>
      </head>
      <body>
        <nav epub:type="toc" id="toc">
          <h1>{title}</h1>
          <ol>{items}</ol>
        </nav>
      </body>
    </html>
  );
}

export function nav(props: Props): string {
  return `${xmlHeader}${xhtmlHeader}${renderToXml(<Nav {...props} />)}`;
}
