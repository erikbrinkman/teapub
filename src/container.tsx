import type { VNode } from "preact";
import { renderToXml, xmlHeader } from "./utils";

interface Props {
  contentOpf?: string;
}

function ContainerXml({ contentOpf = "OEBPS/content.opf" }: Props): VNode {
  return (
    /* eslint-disable spellcheck/spell-checker */
    <container
      xmlns="urn:oasis:names:tc:opendocument:xmlns:container"
      version="1.0"
    >
      {/* eslint-enable spellcheck/spell-checker */}
      <rootfiles>
        <rootfile
          full-path={contentOpf}
          media-type="application/oebps-package+xml"
        />
      </rootfiles>
    </container>
  );
}

export function containerXml(props: Props = {}): string {
  return `${xmlHeader}${renderToXml(<ContainerXml {...props} />)}`;
}
