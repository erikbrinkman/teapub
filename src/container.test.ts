import { containerXml } from "./container";

test("default", () => {
  const container = containerXml();
  expect(container).toContain("OEBPS/content.opf");
});

test("custom", () => {
  const container = containerXml({ contentOpf: "OEBPS/opf.opf" });
  expect(container).toContain("OEBPS/opf.opf");
});
