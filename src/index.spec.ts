import { expect, test } from "bun:test";
import JsZip from "jszip";
import { loremIpsum } from "lorem-ipsum";
import sharp from "sharp";
import { type ImageData, render } from ".";

async function randomImage(): Promise<Uint8Array> {
  const buffer = await sharp({
    create: {
      width: 500,
      height: 300,
      channels: 4,
      background: {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
        alpha: 1,
      },
    },
  })
    .png()
    .toBuffer();
  return new Uint8Array(buffer);
}

test("minimal", async () => {
  // create
  const text = loremIpsum({ count: 10, units: "paragraphs" });
  const formatted = text
    .split("\n")
    .map((par) => `<p>${par}</p>`)
    .join("");
  const buff = await render({
    title: "Simple Book Title",
    sections: [
      { title: "section", content: `<h1>Section Title</h1>${formatted}` },
    ],
  });
  expect(buff.length).toBeGreaterThan(0);

  // validate buffer
  const zip = await JsZip.loadAsync(buff);
  const mimetype = await zip.file("mimetype")?.async("string");
  expect(mimetype).toBe("application/epub+zip");

  // write for external verification
  await Bun.write("minimal.epub", buff);
});

test("advanced", async () => {
  // generate content
  const sections = [];
  const images = new Map<string, ImageData>();
  const frame = `
<!doctype html>
<html><head></head><body><p>inside frame</p></body></html>
  `;
  const frames = new Map<string, string>([["cid:frame", frame]]);
  for (let i = 0; i < 4; ++i) {
    // text content
    const title = loremIpsum({ count: 2, units: "words" });
    const text = loremIpsum({ count: 10, units: "paragraphs" });
    const array = text.split("\n").map((par) => {
      const [first, ...rest] = par.split(" ");
      return `<p><a href="#">${first}</a> ${rest.join(" ")}</p>`;
    });
    array.push(`<iframe src="cid:frame"></iframe>`);

    // image
    const imageName = `[[replace_${i}]].png`;
    const data = await randomImage();
    array.push(`<img src="${imageName}"></img>`);
    images.set(imageName, {
      data,
      mime: i % 2 === 0 ? "image/png" : undefined,
    });

    // write
    const content = array.join("");
    const titleTitle = title
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    sections.push({ title, content: `<h1>${titleTitle}</h1>${content}` });
  }

  // write
  const buff = await render({
    title: "Advanced Book Title",
    author: "Lorem Ipsum",
    publisher: "Advanced Publishing House",
    description: "A book about Latin",
    subjects: ["lorem", "ipsum"],
    copyright: "© today",
    sections,
    images,
    frames,
    css: "a { text-decoration: none; }",
  });
  expect(buff.length).toBeGreaterThan(0);

  // validate
  const zip = await JsZip.loadAsync(buff);
  const mimetype = await zip.file("mimetype")?.async("string");
  expect(mimetype).toBe("application/epub+zip");

  // write for external validation
  await Bun.write("advanced.epub", buff);
});
