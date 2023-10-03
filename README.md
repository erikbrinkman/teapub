TeaPub :tea::beer:
==================
[![build](https://github.com/erikbrinkman/teapub/actions/workflows/build.yml/badge.svg)](https://github.com/erikbrinkman/teapub/actions/workflows/build.yml)
[![docs](https://img.shields.io/badge/docs-docs-blue)](https://erikbrinkman.github.io/teapub/)
[![npm](https://img.shields.io/npm/v/teapub)](https://www.npmjs.com/package/teapub)
[![license](https://img.shields.io/github/license/erikbrinkman/teapub)](LICENSE)

A pure TypeScript preact-based library for generating ePub files. In contrast
to [`html-to-epub`](https://www.npmjs.com/package/html-to-epub) and
[`nodepub`](https://www.npmjs.com/package/nodepub), this runs in any javascript
environment and seeks a more minimal approach to ePub generation rather than
autogenerating content like a cover and table of contents.

Usage
-----

A minimal example

```ts
import { render } from "teapub";

const buffer = await render({
  title: "title",
  sections: [{
    title: "section title",
    content: "<my html>",
  }],
});
```

This library can also include images encoded as buffers. To include them, add
an images mapping that maps the `src` attribute of images in the included html
to buffers with optional mime type.


```ts
import { readFile } from "fs/promises";
import { render } from "teapub";

const data = await readFile("myfile.jpg");

const buffer = await render({
  title: "title",
  sections: [{
    title: "section title",
    content: `<img src="myfile.jpg"></img>`,
  }],
  images: new Map([["myfile.jpg", { data }]]),
});
```

Missing
-------

This is intended as barebones, so a lot of aspects related to generating
"books" as epubs are missing, but easily includable upon request:

- [ ] custom fonts
- [ ] covers, custom or otherwise
- [ ] table of contents page, custom or otherwise
- [ ] customizable node and attribute filtering
