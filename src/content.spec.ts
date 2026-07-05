import { expect, test } from "bun:test";
import { contentOpf } from "./content";

test("simplest", () => {
  const content = contentOpf({
    uid: "1234",
    title: "custom title",
    lang: "en",
    modified: "2026-01-01T00:00:00Z",
    content: [],
  });
  expect(content).not.toContain("::");
  expect(content).toContain("1234");
  expect(content).toContain("custom title");
  expect(content).toContain("en");
});

test("epub 3 shape", () => {
  const content = contentOpf({
    uid: "1234",
    title: "custom title",
    lang: "en",
    modified: "2026-01-01T00:00:00Z",
    content: [
      {
        id: "nav",
        href: "nav.xhtml",
        mediaType: "application/xhtml+xml",
        spine: false,
        properties: "nav",
      },
    ],
  });
  expect(content).toContain(`version="3.0"`);
  expect(content).toContain(
    `property="dcterms:modified">2026-01-01T00:00:00Z</meta>`,
  );
  expect(content).toContain(`properties="nav"`);
  expect(content).toContain(`toc="toc"`);
  expect(content).not.toContain("<guide");
});

test("everything", () => {
  const content = contentOpf({
    uid: "1234",
    title: "custom title",
    author: "author1",
    publisher: "publisher2",
    description: "description3",
    subjects: ["subject4"],
    copyright: "copyright5",
    lang: "en",
    modified: "2026-01-01T00:00:00Z",
    content: [
      {
        id: "id1",
        href: "href1",
        mediaType: "image/png",
        spine: false,
      },
      {
        id: "id2",
        href: "href2",
        mediaType: "application/xhtml+xml",
        spine: true,
      },
    ],
  });
  expect(content).toContain("author1");
  expect(content).toContain("publisher2");
  expect(content).toContain("description3");
  expect(content).toContain("subject4");
  expect(content).toContain("copyright5");

  expect(content).toContain("id1");
  expect(content).toContain("id2");
  expect(content).toContain("href1");
  expect(content).toContain("href2");
});
