import { VNode } from "preact";
import { LangCode, Mime } from "./types";
import { renderToXml, xmlHeader } from "./utils";

export interface ManifestContent {
  id: string;
  href: string;
  mediaType: Mime;
  spine: boolean;
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
  content,
}: Props): VNode {
  const modified = new Date().toISOString();

  const auth = author ? <dc:creator>{author}</dc:creator> : null;
  const publish = publisher ? <dc:publisher>{publisher}</dc:publisher> : null;
  const descr = description ? (
    <dc:description>{description}</dc:description>
  ) : null;
  const subs = subjects.map((sub) => <dc:subject>{sub}</dc:subject>);
  const copy = copyright ? <dc:rights>{copyright}</dc:rights> : null;

  const manifestItems = content.map(({ id, href, mediaType }) => (
    <item id={id} href={href} media-type={mediaType} />
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
        {auth}
        {publish}
        {descr}
        {subs}
        {copy}
        <meta property="dcterms:modified">{modified}</meta>
      </metadata>
      <manifest>{manifestItems}</manifest>
      <spine>{spineItems}</spine>
      <guide></guide>
    </package>
  );
}

export function contentOpf(props: Props): string {
  return `${xmlHeader}${renderToXml(<ContentOpf {...props} />)}`;
}
