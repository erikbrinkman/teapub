import {
  getImageMimeExtension,
  getImageMimeType,
  isImageMimeType,
} from "./image-mime";

test("isImageMimeType()", () => {
  expect(isImageMimeType("image/jpeg")).toBe(true);
  expect(isImageMimeType("image/gif")).toBe(true);
  expect(isImageMimeType("image/svg+xml")).toBe(true);
  expect(isImageMimeType("image/png")).toBe(true);
  expect(isImageMimeType("image/unknown")).toBe(false);
});

test("getImageMimeType()", () => {
  expect(getImageMimeType("test.jpg")).toBe("image/jpeg");
  expect(getImageMimeType("blah/foo.jpeg")).toBe("image/jpeg");
  expect(getImageMimeType(".gif")).toBe("image/gif");
  expect(getImageMimeType("vector.svg")).toBe("image/svg+xml");
  expect(getImageMimeType("/dense.png")).toBe("image/png");
  expect(() => getImageMimeType("error.exe")).toThrow("convert");
});

test("getImageMimeExtension()", () => {
  expect(getImageMimeExtension("image/jpeg")).toBe("jpg");
  expect(getImageMimeExtension("image/gif")).toBe("gif");
  expect(getImageMimeExtension("image/svg+xml")).toBe("svg");
  expect(getImageMimeExtension("image/png")).toBe("png");
  expect(() => getImageMimeExtension("image/unknown" as never)).toThrow(
    "invalid"
  );
});
