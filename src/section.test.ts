import { section } from "./section";

test("basic", () => {
  const sect = section({
    title: "Custom Title",
    content: "<h1>Title</h1><p>custom content</p>",
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("Custom Title");
  expect(sect).toContain("custom content");
});

test("uppercase tags", () => {
  const sect = section({
    title: "Custom Title",
    content: "<h1>Title</h1><P>custom content</P>",
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("Custom Title");
  expect(sect).toContain("<p>custom content</p>");
});

test("string escapes", () => {
  const sect = section({
    title: "title",
    content: "<p>escapes &amp; such!</p>",
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("escapes &amp; such!");
});

test("class names", () => {
  const sect = section({
    title: "title",
    content: `<p class="first second">I have a class</p>`,
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain(`class="first second"`);
});

test("filtered attributes", () => {
  const sect = section({
    title: "title",
    content: `<p data-custom="filtered">I have a data</p>`,
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("filtered");
  expect(sect).toContain("<p>I have a data</p>");
});

test("image remapping", () => {
  const sect = section({
    title: "title",
    content: `<img src="remap" /><p src="remap">text</p>`,
    images: new Map([["remap", "remapped"]]),
    missingImage: "error",
  });
  expect(sect).toContain(`src="remapped"`);
  expect(sect).not.toContain(`p src="remapped"`);
});

test("encoded image src remapping", () => {
  const sect = section({
    title: "title",
    content: `<img src="https://re%22map" /><p src="remap">text</p>`,
    images: new Map([[`https://re"map`, "remapped"]]),
    missingImage: "error",
  });
  expect(sect).toContain(`src="remapped"`);
  expect(sect).not.toContain(`p src="remapped"`);
});

test("missing image error", () => {
  expect(() =>
    section({
      title: "title",
      content: `<img src="missing" />`,
      images: new Map(),
      missingImage: "error",
    })
  ).toThrow("remapped images");
});

test("missing image remove", () => {
  const sect = section({
    title: "title",
    content: `<img src="missing" />`,
    images: new Map(),
    missingImage: "remove",
  });
  expect(sect).toContain("<body></body>");
});

test("missing image ignore", () => {
  const sect = section({
    title: "title",
    content: `<img src="missing" />`,
    images: new Map(),
    missingImage: "ignore",
  });
  expect(sect).toContain(`src="missing"`);
});

test("filtered tags", () => {
  const sect = section({
    title: "title",
    content: `<script><p>but I have secret text</p></script>`,
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("script");
  expect(sect).toContain("I have secret text");
});

test("comments", () => {
  const sect = section({
    title: "title",
    content: "<div><!-- I am a comment --><span>but I'm not</span></div>",
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("comment");
  expect(sect).toContain("I'm not");
});

test("full document", () => {
  const sect = section({
    title: "title",
    content: "<!doctype html><html><body><p>some text</p></body></html>",
    images: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("some text");
});
