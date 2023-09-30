import { VNode } from "preact";
import { renderToXml, xmlHeader } from "./utils";

const ncxHeader = `<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">`;

export interface SectionInfo {
  id: string;
  href: string;
  title: string;
}

interface Props {
  uid: string;
  title: string;
  author?: string;
  sections: readonly SectionInfo[];
}

function TocNcx({ uid, title, author, sections }: Props): VNode {
  const docAuthor = author ? (
    <docAuthor>
      <text>{author}</text>
    </docAuthor>
  ) : null;

  const navPoints = sections.map(({ id, title, href }, i) => (
    <navPoint id={id} playOrder={`${i + 1}`}>
      <navLabel>
        <text>{title}</text>
      </navLabel>
      <content src={href} />
    </navPoint>
  ));

  return (
    <ncx
      version="2005-1"
      xmlLang="en"
      xmlns="http://www.daisy.org/z3986/2005/ncx/"
    >
      <head>
        <meta name="dtb:uid" content={uid} />
        <meta name="dtb:depth" content="1" />
        <meta name="dtb:totalPageCount" content="0" />
        <meta name="dtb:maxPageNumber" content="0" />
      </head>

      <docTitle>
        <text>{title}</text>
      </docTitle>

      {docAuthor}

      <navMap>{navPoints}</navMap>
    </ncx>
  );
}

export function tocNcx(props: Props): string {
  return `${xmlHeader}${ncxHeader}${renderToXml(<TocNcx {...props} />)}`;
}
