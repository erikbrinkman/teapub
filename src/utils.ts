import { VNode } from "preact";
import render from "preact-render-to-string/jsx";

export const xmlHeader = `<?xml version="1.0" encoding="utf-8"?>`;

export function renderToXml(node: VNode): string {
  return render(node, null, { xml: true, pretty: false });
}
