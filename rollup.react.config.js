import path from "node:path";
import { assets, distDir, tsPlugins } from "./rollup.common.js";

export default {
  input: "src/react.ts",
  external: ["react"],
  output: {
    dir: path.join(distDir, "lib"),
    entryFileNames: "react.js",
    chunkFileNames: "chunks/[name]-[hash].js",
    format: "es",
    sourcemap: true,
  },
  plugins: [assets(), ...tsPlugins()],
};
