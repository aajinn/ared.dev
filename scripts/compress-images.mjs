/**
 * compress-images.mjs
 *
 * Losslessly (or near-losslessly) compresses PNG, JPEG, and WebP images
 * inside the /public folder using sharp.
 *
 * Usage:
 *   node scripts/compress-images.mjs              # compress public/
 *   node scripts/compress-images.mjs public/some  # compress a sub-folder
 *
 * Strategy per format:
 *   PNG  → palette-based compression (lossless), effort 10
 *   JPEG → quality 90, mozjpeg encoder (visually lossless for photos)
 *   WebP → lossless mode, effort 6
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const TARGET_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(process.cwd(), "public");

// ── helpers ──────────────────────────────────────────────────────────────────

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) =>
    e.isDirectory()
      ? walk(path.join(dir, e.name))
      : [path.join(dir, e.name)]
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

// ── compress ─────────────────────────────────────────────────────────────────

async function compress(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return null;

  const originalSize = fs.statSync(filePath).size;
  const tmp = filePath + ".tmp";

  try {
    const img = sharp(filePath);

    if (ext === ".png") {
      await img
        .png({ compressionLevel: 9, effort: 10, palette: true })
        .toFile(tmp);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      await img
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(tmp);
    } else if (ext === ".webp") {
      await img
        .webp({ lossless: true, effort: 6 })
        .toFile(tmp);
    }

    const newSize = fs.statSync(tmp).size;

    if (newSize < originalSize) {
      fs.renameSync(tmp, filePath);
      const saved = originalSize - newSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);
      return { filePath, originalSize, newSize, saved, pct };
    } else {
      // Compressed version is larger — keep original
      fs.unlinkSync(tmp);
      return { filePath, originalSize, newSize: originalSize, saved: 0, pct: "0.0" };
    }
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    throw err;
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const files = walk(TARGET_DIR).filter((f) =>
    SUPPORTED.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No supported images found in", TARGET_DIR);
    return;
  }

  console.log(`\nCompressing ${files.length} image(s) in ${TARGET_DIR}\n`);

  let totalOriginal = 0;
  let totalNew = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      const result = await compress(file);
      if (!result) continue;

      totalOriginal += result.originalSize;
      totalNew += result.newSize;

      const tag = result.saved > 0 ? `✓ -${result.pct}%` : "· no gain";
      console.log(
        `  ${tag.padEnd(12)} ${rel}  (${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)})`
      );
    } catch (err) {
      console.error(`  ✗ failed   ${rel}: ${err.message}`);
    }
  }

  const totalSaved = totalOriginal - totalNew;
  const totalPct = totalOriginal > 0
    ? ((totalSaved / totalOriginal) * 100).toFixed(1)
    : "0.0";

  console.log("\n─────────────────────────────────────────");
  console.log(
    `  Total saved: ${formatBytes(totalSaved)} (${totalPct}%)  ` +
    `${formatBytes(totalOriginal)} → ${formatBytes(totalNew)}`
  );
  console.log("─────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
