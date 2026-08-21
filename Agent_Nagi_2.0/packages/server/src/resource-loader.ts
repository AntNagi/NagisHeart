import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseResourceMarkdown, type ResourceBlock } from "@nagi/core";

function markdownFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "_sources" || entry.name === "MANIFEST.md") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files.sort();
}

/** Loads only server-side resource descriptors; raw source files are excluded. */
export function loadResourceBlocks(root: string): readonly ResourceBlock[] {
  const files = markdownFiles(root);
  const resources: ResourceBlock[] = [];
  for (const file of files) {
    const parsed = parseResourceMarkdown(readFileSync(file, "utf8"));
    resources.push(parsed);
  }
  return resources;
}
