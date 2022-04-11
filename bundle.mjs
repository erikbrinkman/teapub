import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import chalk from "chalk";
import { build } from "esbuild";
import ignorePlugin from "esbuild-plugin-ignore";
import { stat } from "node:fs/promises";
import { parse } from "node:path";
import { performance } from "perf_hooks";

const name = "prepub";
const config = {
  plugins: [
    ignorePlugin([
      { resourceRegExp: /^util$/ },
      { resourceRegExp: /^buffer$/ },
      { resourceRegExp: /^stream$/ },
      { resourceRegExp: /^events$/ },
    ]),
    pnpPlugin(),
  ],
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  jsxFactory: "h",
  jsxFragment: "Fragment",
  inject: ["src/preact-shim.ts"],
};

const start = performance.now();

async function wrapper(options) {
  const res = await build(options);
  const { outfile } = options;
  const { size } = await stat(outfile);
  const { dir, base } = parse(outfile);
  console.log(
    chalk.white(`\n  ${dir}/`) + chalk.bold(`${base}`),
    chalk.cyan(` ${(size / 1024).toFixed(1)}kb`)
  );
  return res;
}

await Promise.all([
  wrapper({
    ...config,
    platform: "node",
    outfile: `bundle/${name}.cjs.min.js`,
  }),
  wrapper({
    ...config,
    platform: "browser",
    globalName: name,
    outfile: `bundle/${name}.iife.min.js`,
  }),
  wrapper({
    ...config,
    platform: "neutral",
    outfile: `bundle/${name}.esm.min.js`,
  }),
]);

const elapsed = Math.round(performance.now() - start);
console.log("\n⚡", chalk.green(`Done in ${elapsed}ms`));
