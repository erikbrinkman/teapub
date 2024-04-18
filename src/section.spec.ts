import { expect, test } from "bun:test";
import { section } from "./section";

test("basic", () => {
  const sect = section({
    title: "Custom Title",
    content: "<h1>Title</h1><p>custom content</p>",
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("::");
  expect(sect).toContain("Custom Title");
  expect(sect).toContain("custom content");
});

test("uppercase tags", () => {
  const sect = section({
    title: "Custom Title",
    content: "<h1>Title</h1><P>custom content</P>",
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("Custom Title");
  expect(sect).toContain("<p>custom content</p>");
});

test("string escapes", () => {
  const sect = section({
    title: "title",
    content: "<p>escapes &amp; such!</p>",
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("escapes &amp; such!");
});

test("class names", () => {
  const sect = section({
    title: "title",
    content: `<p class="first second">I have a class</p>`,
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain(`class="first second"`);
});

test("filtered attributes", () => {
  const sect = section({
    title: "title",
    content: `<p data-custom="filtered">I have a data</p>`,
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("filtered");
  expect(sect).toContain("<p>I have a data</p>");
});

test("image remapping", () => {
  const sect = section({
    title: "title",
    content: `<img src="remap" /><p src="remap">text</p>`,
    remapping: new Map([["remap", "remapped"]]),
    missingImage: "error",
  });
  expect(sect).toContain(`src="remapped"`);
  expect(sect).not.toContain(`p src="remapped"`);
});

test("encoded image src remapping", () => {
  const sect = section({
    title: "title",
    content: `<img src="https://re%22map" /><p src="remap">text</p>`,
    remapping: new Map([[`https://re"map`, "remapped"]]),
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
      remapping: new Map(),
      missingImage: "error",
    }),
  ).toThrow("img src");
});

test("missing image remove", () => {
  const sect = section({
    title: "title",
    content: `<img src="missing" />`,
    remapping: new Map(),
    missingImage: "remove",
  });
  expect(sect).toContain("<body />");
  expect(sect).not.toContain("<img");
});

test("missing image ignore", () => {
  const sect = section({
    title: "title",
    content: `<img src="missing" />`,
    remapping: new Map(),
    missingImage: "ignore",
  });
  expect(sect).toContain(`src="missing"`);
});

test("frame remapping", () => {
  const sect = section({
    title: "title",
    content: `<iframe src="remap" />`,
    remapping: new Map([["remap", "remapped"]]),
    missingImage: "error",
  });
  expect(sect).toContain(`src="remapped"`);
});

test("missing frame error", () => {
  expect(() =>
    section({
      title: "title",
      content: `<iframe src="missing" />`,
      remapping: new Map(),
      missingImage: "error",
    }),
  ).toThrow("iframe src");
});

test("missing iframe remove", () => {
  const sect = section({
    title: "title",
    content: `<iframe src="missing" />`,
    remapping: new Map(),
    missingImage: "remove",
  });
  expect(sect).toContain("<body />");
  expect(sect).not.toContain("<iframe");
});

test("missing iframe ignore", () => {
  const sect = section({
    title: "title",
    content: `<iframe src="missing" />`,
    remapping: new Map(),
    missingImage: "ignore",
  });
  expect(sect).toContain(`src="missing"`);
});

test("filtered tags", () => {
  const sect = section({
    title: "title",
    content: `<script><p>but I have secret text</p></script>`,
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("script");
  expect(sect).toContain("I have secret text");
});

test("comments", () => {
  const sect = section({
    title: "title",
    content: "<div><!-- I am a comment --><span>but I'm not</span></div>",
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).not.toContain("comment");
  expect(sect).toContain("I'm not");
});

test("pre", () => {
  const sect = section({
    title: "title",
    content: "<pre>a<span>b</span>c</pre>",
    remapping: new Map(),
    missingImage: "error",
  });
  expect(sect).toContain("a<span>b</span>c");
});

test("svg", () => {
  const svg = section({
    title: "title",
    content: `<svg
  stroke="currentColor"
  fill="none"
  stroke-width="0"
  viewBox="0 0 15 15"
  height="1em"
  width="1em"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386      12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8     536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5     C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.146     45 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2      9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
    fill="currentColor"
  />
</svg>`,
    remapping: new Map(),
    missingImage: "error",
  });
  expect(svg).toContain(`height="1em"`);
  expect(svg).toContain("<path");
  expect(svg).toContain(`d="`);
});

test("full document", () => {
  const sect = section({
    title: "title",
    content: `<!doctype html><html><body><p>some text</p><img src="img.png"></body></html>`,
    remapping: new Map([["img.png", "img.png"]]),
    missingImage: "error",
  });
  expect(sect).toContain("some text");
  expect(sect).toMatch(/<img\s+src="img.png"\s+\/>/);
});
