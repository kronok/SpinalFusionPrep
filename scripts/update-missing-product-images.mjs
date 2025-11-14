#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as prompts from "@inquirer/prompts";

const AMAZON_URL_PATTERN =
  /https?:\/\/(([\w.-]+\.)?amazon\.[a-z.]+|amzn\.to)\/?/i;
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const SUPPORTED_FORMATS = new Map([
  [".jpg", "jpeg"],
  [".jpeg", "jpeg"],
  [".png", "png"],
  [".webp", "webp"],
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const productsFilePath = join(projectRoot, "src", "data", "products.ts");
const imagesDir = join(projectRoot, "public", "images");

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (err) {
    if (err && err.code !== "ENOENT") throw err;
    return false;
  }
}

function extractProductsArraySource(source) {
  const exportIndex = source.indexOf("export const products");
  if (exportIndex === -1) {
    throw new Error("Could not locate products array in products.ts");
  }
  const arrayStart = source.indexOf("[", exportIndex);
  const arrayEnd = source.lastIndexOf("]");
  if (arrayStart === -1 || arrayEnd === -1 || arrayEnd <= arrayStart) {
    throw new Error("Malformed products array in products.ts");
  }
  return source.slice(arrayStart, arrayEnd + 1);
}

function parseProductsFromSource(source) {
  const arraySource = extractProductsArraySource(source);
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${arraySource});`);
    return fn();
  } catch (err) {
    throw new Error(`Failed to parse products array: ${err.message}`);
  }
}

function extractImageUrlFromHtml(html) {
  const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (imageMatch) return imageMatch[1];
  const hiResMatch = html.match(/"hiRes":"(https:[^"]+)"/i);
  if (hiResMatch) {
    return hiResMatch[1].replace(/\\u0026/g, "&");
  }
  return null;
}

async function fetchProductHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch product page (${response.status} ${response.statusText})`);
  }
  return response.text();
}

function determineImageTarget(imageUrl) {
  const rawExt = extname(new URL(imageUrl).pathname).toLowerCase();
  let extension = rawExt && rawExt.length <= 5 ? rawExt : ".jpg";
  let format = SUPPORTED_FORMATS.get(extension);
  if (!format) {
    extension = ".jpg";
    format = "jpeg";
  }
  return { extension, format };
}

async function downloadAndResizeImage(imageUrl, destinationPath, format) {
  const response = await fetch(imageUrl, {
    headers: { "user-agent": USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status} ${response.statusText})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const transformer = sharp(buffer)
    .rotate()
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true });
  const formatOptions = format === "jpeg" || format === "webp" ? { quality: 85 } : undefined;
  const optimized = await transformer.toFormat(format, formatOptions).toBuffer();
  await mkdir(dirname(destinationPath), { recursive: true });
  await writeFile(destinationPath, optimized);
}

function escapeRegExp(text) {
  return text.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

function updateProductImageInSource(source, productId, newFilename) {
  const pattern = new RegExp(
    `(id:\\s*["']${escapeRegExp(productId)}["'][\\s\\S]*?image:\\s*)(["'])[^"']*\\2`
  );
  const match = pattern.exec(source);
  if (!match) {
    throw new Error(`Unable to update image for product id ${productId}`);
  }
  const replacement = `${match[1]}${match[2]}${newFilename}${match[2]}`;
  return `${source.slice(0, match.index)}${replacement}${source.slice(match.index + match[0].length)}`;
}

async function main() {
  const productsSource = await readFile(productsFilePath, "utf8");
  const products = parseProductsFromSource(productsSource);

  const missingProducts = [];
  for (const product of products) {
    if (!product?.id) continue;
    const imageName = product.image;
    const hasCustomImage = imageName && imageName !== "placeholder.png";
    const imagePath = imageName ? join(imagesDir, imageName) : null;
    const exists = imagePath ? await fileExists(imagePath) : false;
    if (!hasCustomImage || !exists) {
      missingProducts.push(product);
    }
  }

  if (missingProducts.length === 0) {
    console.log("All products already have images on disk.");
    return;
  }

  console.log(`Found ${missingProducts.length} product(s) missing images.\n`);

  let updatedSource = productsSource;
  let updatedCount = 0;

  for (const product of missingProducts) {
    console.log(`Processing ${product.name} (${product.id})`);

    let html = null;
    let imageUrl = null;
    if (product.link && AMAZON_URL_PATTERN.test(product.link)) {
      try {
        html = await fetchProductHtml(product.link);
        imageUrl = extractImageUrlFromHtml(html);
      } catch (err) {
        console.warn(`  Unable to fetch listing automatically: ${err.message}`);
      }
    } else {
      console.warn("  Product link is missing or not an Amazon URL.");
    }

    if (!imageUrl) {
      console.log(`  Listing: ${product.link || "(no link provided)"}`);
      const manualImage = await prompts.input({
        message: "  Enter an image URL (leave blank to skip)",
      });
      if (!manualImage) {
        console.log("  Skipped.\n");
        continue;
      }
      imageUrl = manualImage.trim();
    }

    try {
      const { extension, format } = determineImageTarget(imageUrl);
      const filename = `${product.id}${extension}`;
      const destination = join(imagesDir, filename);
      await downloadAndResizeImage(imageUrl, destination, format);
      updatedSource = updateProductImageInSource(updatedSource, product.id, filename);
      updatedCount += 1;
      console.log(`  Saved optimized image as public/images/${filename}.\n`);
    } catch (err) {
      console.error(`  Failed to update image: ${err.message}\n`);
    }
  }

  if (updatedCount > 0) {
    await writeFile(productsFilePath, updatedSource, "utf8");
    console.log(`Updated ${updatedCount} product(s) in src/data/products.ts.`);
  } else {
    console.log("No changes were written to src/data/products.ts.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
