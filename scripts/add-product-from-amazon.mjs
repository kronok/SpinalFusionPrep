#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as prompts from "@inquirer/prompts"; // <-- NEW
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const productsFilePath = join(projectRoot, "src", "data", "products.ts");
const imagesDir = join(projectRoot, "public", "images");

const AMAZON_URL_PATTERN =
  /https?:\/\/(([\w.-]+\.)?amazon\.[a-z.]+|amzn\.to)\/?/i;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/__+/g, "_");
}

function extractCategoriesFromProductsSource(source) {
  const categorySet = new Set();
  const categoriesBlockRegex = /categories\s*:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = categoriesBlockRegex.exec(source)) !== null) {
    const inner = match[1];
    const items = inner.split(",").map((s) => s.trim());
    for (const item of items) {
      const unquoted = item.replace(/^["'`](.*)["'`]$/, "$1").trim();
      if (unquoted) categorySet.add(unquoted);
    }
  }
  return categorySet;
}

async function main() {
  const url = process.argv[2];
  if (!url || !AMAZON_URL_PATTERN.test(url)) {
    console.error("Please provide a valid Amazon product URL or amzn.to short link.");
    process.exit(1);
  }

  const productsFile = await readFile(productsFilePath, "utf8");
  const existingCategories = extractCategoriesFromProductsSource(productsFile);

  if (existingCategories.size === 0) {
    console.error("No categories found in src/data/products.ts.");
    process.exit(1);
  }

  console.log("Fetching product page...");
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    console.error(`Failed to fetch product page: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const html = await response.text();

  const titleMatch =
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
    html.match(/<span\s+id="productTitle"[^>]*>([^<]+)/i);
  const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);

  const rawName = titleMatch ? titleMatch[1].trim() : "";
  const defaultName = rawName.replace(/\s*\|\s*Amazon\.com.*$/i, "").trim();
  const defaultDescription = descriptionMatch ? descriptionMatch[1].trim() : "";

  // ---- use inquirer-style prompts instead of manual readline ----
  const name = await prompts.input({
    message: `Product name`,
    default: defaultName || undefined,
  });

  const description = await prompts.input({
    message: `Product description`,
    default: defaultDescription || "",
  });

  // checkbox prompt for categories
  const sortedCategories = Array.from(existingCategories).sort();
  const chosenCategories = await prompts.checkbox({
    message: "Select categories (Space to toggle, Enter to confirm):",
    choices: sortedCategories.map((c) => ({ name: c, value: c })),
    validate: (val) =>
      val.length > 0 ? true : "Please select at least one category.",
  });

  // ---------------------------------------------------------------

  if (!name) {
    console.error("A product name is required.");
    process.exit(1);
  }

  const id = slugify(name);
  if (productsFile.includes(`id: "${id}"`)) {
    console.error(`A product with id "${id}" already exists.`);
    process.exit(1);
  }

  // image handling (same as before)
  let imageUrl = imageMatch ? imageMatch[1] : "";
  if (!imageUrl) {
    const imageCandidate = html.match(/"hiRes":"(https:[^"]+)"/i);
    if (imageCandidate) {
      imageUrl = imageCandidate[1].replace(/\\u0026/g, "&");
    }
  }

  if (!imageUrl) {
    const manualImage = await prompts.input({
      message: "Image URL (required):",
    });
    if (!manualImage) {
      console.error("No image URL provided. Aborting.");
      process.exit(1);
    }
    imageUrl = manualImage;
  }

  console.log(`Downloading product image from ${imageUrl}`);
  const imageResponse = await fetch(imageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!imageResponse.ok) {
    console.error(
      `Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`
    );
    process.exit(1);
  }

  const imageExtensionFromUrl = extname(new URL(imageUrl).pathname).toLowerCase();
  const supportedFormats = new Map([
    [".jpg", "jpeg"],
    [".jpeg", "jpeg"],
    [".png", "png"],
    [".webp", "webp"],
  ]);
  let imageExtension =
    imageExtensionFromUrl && imageExtensionFromUrl.length <= 5
      ? imageExtensionFromUrl
      : ".jpg";
  let outputFormat = supportedFormats.get(imageExtension);
  if (!outputFormat) {
    imageExtension = ".jpg";
    outputFormat = "jpeg";
  }
  const imageFilename = `${id}${imageExtension}`;
  const imagePath = join(imagesDir, imageFilename);

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const sharpInstance = sharp(imageBuffer)
    .rotate()
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
      withoutEnlargement: true,
    });
  const formatOptions =
    outputFormat === "jpeg" || outputFormat === "webp"
      ? { quality: 85 }
      : undefined;
  const optimizedBuffer = await sharpInstance.toFormat(outputFormat, formatOptions).toBuffer();

  await mkdir(imagesDir, { recursive: true });
  await writeFile(imagePath, optimizedBuffer);

  console.log(`Saved image to public/images/${imageFilename}`);

  const categoriesString = chosenCategories.map((c) => JSON.stringify(c)).join(", ");
  const newProductEntry = `  ,\n  {\n    id: ${JSON.stringify(
    id
  )},\n    name: ${JSON.stringify(
    name
  )},\n    description: ${JSON.stringify(
    description
  )},\n    categories: [${categoriesString}],\n    image: ${JSON.stringify(
    imageFilename
  )},\n    link: ${JSON.stringify(url)}\n  }`;

  const insertionPoint = productsFile.lastIndexOf("]");
  if (insertionPoint === -1) {
    console.error("Could not find product array in products.ts.");
    process.exit(1);
  }

  const updatedProductsFile = `${productsFile
    .slice(0, insertionPoint)
    .trimEnd()}\n${newProductEntry}\n]\n`;
  await writeFile(productsFilePath, updatedProductsFile, "utf8");

  console.log(`Added ${name} to products.ts with id ${id}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
