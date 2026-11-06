import fs from "node:fs";
import path from "node:path";

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error("Usage: npm run new -- <path> [<path> ...]");
  process.exit(1);
}

for (const input of targets) {
  const p = path.normalize(input);
  // a trailing slash/backslash or a name without an extension means "folder"
  const isDir = /[\\/]$/.test(input) || path.extname(p) === "";

  if (isDir) {
    fs.mkdirSync(p, { recursive: true });
    console.log(`dir   ${p}`);
    continue;
  }

  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (fs.existsSync(p)) {
    console.log(`skip  ${p} (already exists)`);
  } else {
    fs.writeFileSync(p, "");
    console.log(`file  ${p}`);
  }
}
