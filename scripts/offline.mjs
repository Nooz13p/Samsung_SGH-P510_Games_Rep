import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = [];
async function visit(dir = "") {
  for (const e of await readdir("dist/" + dir, { withFileTypes: true })) {
    const path = dir + e.name;
    if (e.isDirectory()) await visit(path + "/");
    else if (path !== "sw.js") files.push(path);
  }
}
await visit();
files.sort();
const hash = createHash("sha256");
for (const f of files) hash.update(await readFile("dist/" + f));
const source = await readFile("public/sw.js", "utf8");
hash.update(source);
await writeFile(
  "dist/sw.js",
  source
    .replace("__CACHE_VERSION__", hash.digest("hex").slice(0, 16))
    .replace("__PRECACHE_FILES__", JSON.stringify(["./", ...files])),
);
console.log(`Precached ${files.length} local files`);
