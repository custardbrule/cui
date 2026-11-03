import path from "node:path";
import { assets, distDir, tsPlugins } from "./rollup.common.js";

const libDir = path.join(distDir, "lib");

export default {
  input: "src/index.ts",
  output: {
    file: path.join(libDir, "index.js"),
    format: "es",
    sourcemap: true,
  },
  plugins: [assets(), ...tsPlugins()],
};
