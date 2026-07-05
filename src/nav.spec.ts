import { expect, test } from "bun:test";
import { nav } from "./nav";

test("simple", () => {
  const content = nav({
    title: "custom title",
    sections: [],
  });
  expect(content).not.toContain("::");
  expect(content).toContain("<!DOCTYPE html>");
  expect(content).toContain(`epub:type="toc"`);
  expect(content).toContain(`xmlns:epub="http://www.idpf.org/2007/ops"`);
  expect(content).toContain("custom title");
});

test("sections become an ordered list of links", () => {
  const content = nav({
    title: "book",
    lang: "fr",
    sections: [
      { href: "section_0.xhtml", title: "First" },
      { href: "section_1.xhtml", title: "Second" },
    ],
  });
  expect(content).toContain(`xml:lang="fr"`);
  expect(content).toContain(`href="section_0.xhtml">First</a>`);
  expect(content).toContain(`href="section_1.xhtml">Second</a>`);
  expect(content).toContain("<ol>");
});
