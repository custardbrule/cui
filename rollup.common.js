import path from "node:path";
import fs from "node:fs";
import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export const srcDir = path.resolve("src");
export const sharedDir = path.join(srcDir, "shared");
export const distDir = path.resolve("dist");

// src/shared/styles.css -> <abs>/dist/shared/styles.js
export const toDist = (abs) =>
  path.join(distDir, path.relative(srcDir, abs)).replace(/\.(ts|css)$/, ".js");

// src/input/v1/element.ts -> <abs>/dist/input/v1
export const toOutDir = (file) =>
  path.join(distDir, path.relative(srcDir, path.dirname(path.resolve(file))));

export const assets = ({ externalizeShared = false, outDir } = {}) => {
  return {
    name: "assets",

    async resolveId(source, importer) {
      let abs;
      if (source.startsWith("@/")) {
        abs = path.join(srcDir, source.slice(2));
      } else if (importer && source.startsWith(".")) {
        abs = path.resolve(path.dirname(importer), source);
      } else {
        return null;
      }

      // not css/html: only the alias needs help (e.g. "@/shared/util")
      if (!/\.(css|html)$/.test(abs)) {
        return source.startsWith("@/")
          ? this.resolve(abs, importer, { skipSelf: true })
          : null;
      }

      // shared css -> external, written as a relative path like ../../shared/styles.js
      if (
        externalizeShared &&
        outDir &&
        abs.endsWith(".css") &&
        abs.startsWith(sharedDir + path.sep)
      ) {
        let rel = path.relative(outDir, toDist(abs)).split(path.sep).join("/");
        if (!rel.startsWith(".")) rel = "./" + rel;
        return { id: rel, external: "absolute" }; // "absolute" = emit the id untouched
      }

      return abs; // everything else gets inlined by load()
    },

    load(id) {
      if (id.endsWith(".css")) {
        this.addWatchFile(id);
        const css = fs.readFileSync(id, "utf8");
        return `
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(${JSON.stringify(css)});
          export default sheet;
        `;
      }
      if (id.endsWith(".html")) {
        this.addWatchFile(id);
        return `export default ${JSON.stringify(fs.readFileSync(id, "utf8"))};`;
      }
      return null;
    },
  };
};

export const copyFiles = (pairs) => {
  return {
    name: "copy-files",
    writeBundle() {
      for (const [from, to] of pairs) {
        fs.cpSync(from, to, { recursive: true });
      }
    },
  };
};

// the esbuild/terser pair is repeated everywhere, so wrap it once
export const tsPlugins = () => [
  resolve({ extensions: [".ts", ".js"] }),
  esbuild({ target: "es2022", tsconfig: "./tsconfig.json" }),
  terser(),
];
