import fg from "fast-glob";
import path from "node:path";
import terser from "@rollup/plugin-terser";
import { assets, toDist, toOutDir, tsPlugins } from "./rollup.common.js";

const sharedConfigs = fg.sync("src/shared/**/*.{css,scss,svg}").map((file) => ({
  input: file,
  output: { file: toDist(path.resolve(file)), format: "es" },
  plugins: [assets(), terser()],
}));

const elementConfigs = fg.sync("src/**/element.ts").map((file) => {
  const outDir = toOutDir(file);
  return {
    input: file,
    output: {
      file: path.join(outDir, "index.js"),
      format: "es",
      sourcemap: true,
      externalImportAttributes: false,
    },
    plugins: [assets({ externalizeShared: true, outDir }), ...tsPlugins()],
  };
});

export default [...sharedConfigs, ...elementConfigs];
