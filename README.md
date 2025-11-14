# Spinal Fusion Prep Guide

A Vue 3 + TypeScript + Vite project that curates helpful products and tips for people preparing for spinal fusion surgery.

## Development

```bash
npm install
npm run dev
```

Run the production build locally:

```bash
npm run build
npm run preview
```

## Adding a new Amazon product

Use the helper script to pull the main product image and scaffold an entry in `src/data/products.ts`.

```bash
npm run add:product -- https://www.amazon.com/dp/EXAMPLE
```

The script will:

1. Fetch the product metadata (title, description, primary image).
2. Prompt you to confirm or edit the name, description, and categories.
3. Download the main image into `public/images` and create a unique filename.
4. Append a new product object to the data file with the image filename and link.

If the Amazon link already exists or the metadata cannot be retrieved, the script will exit with an error message so nothing is changed.