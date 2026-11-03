import path from "node:path";
import { copyFiles, distDir, tsPlugins } from "./rollup.common.js";

export default {
  input: "index.ts",
  output: { file: path.join(distDir, "index.js"), format: "es" },
  plugins: [
    ...tsPlugins(),
    copyFiles([
      ["src/public", "dist/public"],
      ["index.html", "dist/index.html"],
      ["404.html", "dist/404.html"],
    ]),
  ],
};
