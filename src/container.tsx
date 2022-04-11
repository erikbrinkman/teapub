import { VNode } from "preact";
import render from "preact-render-to-string";
import { xmlHeader } from "./utils";

interface Props {
  contentOpf?: string;
}

function ContainerXml({ contentOpf = "OEBPS/content.opf" }: Props): VNode {
  return (
    <container
      xmlns="urn:oasis:names:tc:opendocument:xmlns:container"
      version="1.0"
    >
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
  return `${xmlHeader}${render(<ContainerXml {...props} />)}`;
}
