import type { VNode } from "preact";
import type { LangCode, Mime } from "./types.js";
import { renderToXml, xmlHeader } from "./utils.js";

export interface ManifestContent {
  id: string;
  href: string;
  mediaType: Mime;
  spine: boolean;
  // manifest properties, e.g. "nav" for the navigation document
  properties?: string;
}

interface Props {
  uid: string;
  title: string;
  author?: string;
  publisher?: string;
  copyright?: string;
  subjects?: readonly string[];
  description?: string;
  lang: LangCode;
  // dcterms:modified timestamp, formatted CCYY-MM-DDThh:mm:ssZ
  modified: string;
  content: readonly ManifestContent[];
}

function ContentOpf({
  uid,
  title,
  author,
  publisher,
  copyright,
  subjects = [],
  description,
  lang,
  modified,
  content,
}: Props): VNode {
  const auth = author ? <dc:creator>{author}</dc:creator> : null;
  const publish = publisher ? <dc:publisher>{publisher}</dc:publisher> : null;
  const descr = description ? (
    <dc:description>{description}</dc:description>
  ) : null;
  const subs = subjects.map((sub) => <dc:subject>{sub}</dc:subject>);
  const copy = copyright ? <dc:rights>{copyright}</dc:rights> : null;

  const manifestItems = content.map(({ id, href, mediaType, properties }) => (
    <item id={id} href={href} media-type={mediaType} properties={properties} />
  ));
  const spineItems = content.map(({ id, spine }) =>
    spine ? <itemref idref={id} /> : null,
  );

  return (
    <package
      xmlns="http://www.idpf.org/2007/opf"
      xmlnsOpf="http://www.idpf.org/2007/opf"
      version="3.0"
      unique-identifier="BookId"
    >
      {/* @ts-expect-error metadata now part of svg, so manual tags no longer work */}
      <metadata xmlnsDc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="BookId">{uid}</dc:identifier>
        <dc:title>{title}</dc:title>
        <dc:language>{lang}</dc:language>
        {/* biome-ignore lint/correctness/noVoidElementsWithChildren: EPUB 3 OPF meta carries its value as text content */}
        <meta property="dcterms:modified">{modified}</meta>
        {auth}
        {publish}
        {descr}
        {subs}
        {copy}
      </metadata>
      <manifest>{manifestItems}</manifest>
      <spine toc="toc">{spineItems}</spine>
    </package>
  );
}

export function contentOpf(props: Props): string {
  return `${xmlHeader}${renderToXml(<ContentOpf {...props} />)}`;
}
