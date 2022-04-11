import { contentOpf } from "./content";

test("simplest", () => {
  const content = contentOpf({
    uid: "1234",
    title: "custom title",
    lang: "en",
    content: [],
  });
  expect(content).toContain("1234");
  expect(content).toContain("custom title");
  expect(content).toContain("en");
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
