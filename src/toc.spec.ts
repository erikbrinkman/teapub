import { expect, test } from "bun:test";
import { tocNcx } from "./toc";

test("simple", () => {
  const content = tocNcx({
    uid: "1234",
    title: "custom title",
    sections: [],
  });
  expect(content).not.toContain("::");
  expect(content).toContain("1234");
  expect(content).toContain("custom title");
});

test("complex", () => {
  const content = tocNcx({
    uid: "1234",
    author: "author1",
    title: "custom title",
    sections: [
      {
        id: "id2",
        href: "href3",
        title: "title4",
      },
    ],
  });
  expect(content).toContain("author1");
  expect(content).toContain("id2");
  expect(content).toContain("href3");
  expect(content).toContain("title4");
});
