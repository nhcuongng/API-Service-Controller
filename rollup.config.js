import { terser } from "rollup-plugin-terser";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import typescript from 'rollup-plugin-typescript2'
import { babel } from "@rollup/plugin-babel";
import nodePolyfills from 'rollup-plugin-node-polyfills';
import * as path from "path";
import json from '@rollup/plugin-json';
import pkg from "./package.json";

const moduleName = pkg.name.replace(/^@.*\//, "");
const inputFileName = "src/index.ts";
const author = pkg.author;
const banner = `
  /**
   * @license
   * author: ${author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;

export default [
  {
    input: inputFileName,
    output: [
      {
        name: moduleName,
        file: pkg.browser,
        format: "iife",
        sourcemap: "inline",
        banner,
        extend: true,
      },
      {
        name: moduleName,
        file: pkg.browser.replace(".js", ".min.js"),
        format: "iife",
        sourcemap: "inline",
        banner,
        plugins: [terser()],
        extend: true
      },
    ],
    plugins: [
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: ['**/__tests__/**'],
        clean: true
      }),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      nodePolyfills(),
      pluginNodeResolve({
        browser: true,
      }),
      json(),
    ],
  },

  // ES
  {
    input: inputFileName,
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: "inline",
        banner,
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: ['**/__tests__/**'],
        clean: true
      }),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      nodePolyfills(),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },

  // CommonJS
  {
    input: inputFileName,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: "inline",
        banner,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: ['**/__tests__/**'],
        clean: true,
      }),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      nodePolyfills(),
      pluginNodeResolve({
        browser: true,
      }),
      json(),
    ],
  },
];
