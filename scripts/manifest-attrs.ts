import { readFileSync, writeFileSync } from "node:fs";
import {
  FORWARDED,
  HANDLER_ATTRS,
  TEXTAREA_FORWARDED,
} from "../src/shared/constants";

const file = "dist/lib/custom-elements.json";
const manifest = JSON.parse(readFileSync(file, "utf8"));

for (const mod of manifest.modules) {
  for (const decl of mod.declarations ?? []) {
    if (decl.tagName !== "sample-input-v1") continue;
    decl.attributes ??= [];
    const have = new Set(decl.attributes.map((a: { name: string }) => a.name));

    for (const name of [
      ...FORWARDED,
      ...HANDLER_ATTRS,
      ...TEXTAREA_FORWARDED,
    ]) {
      if (have.has(name)) continue;
      decl.attributes.push({
        name,
        description: name.startsWith("c-on")
          ? `Handler code, becomes \`${name.slice(2)}\` on the inner input.`
          : "Forwarded to the inner input.",
      });
    }
  }
}

writeFileSync(file, JSON.stringify(manifest, null, 2));
