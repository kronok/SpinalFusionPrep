import { products, type Product } from '../src/data/products'
import { load } from 'cheerio'

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

interface ProductCheckResult {
  product: Product
  status?: number
  ok: boolean
  availability: 'in-stock' | 'unavailable' | 'unknown'
  finalUrl?: string
  issues: string[]
}

function isAmazonUrl(url: string) {
  return /(?:amazon|amzn)\./i.test(url)
}

function detectAmazonAvailability(html: string): ProductCheckResult['availability'] {
  const normalized = html.replace(/\s+/g, ' ').toLowerCase()

  // Strong positive "can buy this" signals
  const hasAddToCartText =
    normalized.includes('add to cart') ||
    normalized.includes('buy now') ||
    normalized.includes('purchase options and add-ons') ||
    // Many items that are only 3rd-party show this but are still purchasable
    normalized.includes('other sellers')

  const hasInStockText =
    normalized.includes('in stock') ||
    normalized.includes('available to ship') ||
    normalized.includes('ready to ship')

  const hasUnavailableText = /(currently unavailable|temporarily out of stock|out of stock)/.test(
    normalized
  )

  // 1) If we clearly see a way to buy it, treat as in-stock
  if (hasAddToCartText || hasInStockText) {
    return 'in-stock'
  }

  // 2) Only treat as unavailable if we see the bad words *and* no positive signals
  if (hasUnavailableText) {
    return 'unavailable'
  }

  // 3) Everything else is unknown
  return 'unknown'
}



async function checkProduct(product: Product): Promise<ProductCheckResult> {
  const result: ProductCheckResult = {
    product,
    ok: false,
    availability: 'unknown',
    issues: []
  }

  try {
    const response = await fetch(product.link, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'user-agent': USER_AGENT,
        'accept-language': 'en-US,en;q=0.9'
      }
    })

    result.status = response.status
    result.ok = response.ok
    result.finalUrl = response.url

    if (!response.ok) {
      result.issues.push(`Request failed with status ${response.status}`)
      return result
    }

    if (response.headers.get('content-type')?.includes('text/html')) {
      const html = await response.text()
      if (isAmazonUrl(response.url)) {
        result.availability = detectAmazonAvailability(html)
        if (result.availability === 'unavailable') {
          result.issues.push('Product appears to be unavailable on Amazon')
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    result.issues.push(`Request error: ${message}`)
  }

  return result
}

async function main() {
  const checks = await Promise.all(products.map(checkProduct))

  const tableData = checks.map((check) => ({
    id: check.product.id,
    status: check.status ?? 'ERR',
    ok: check.ok,
    availability: check.availability,
    finalUrl: check.finalUrl ?? 'n/a',
    issues: check.issues.join('; ') || 'None'
  }))

  console.table(tableData)

  const failed = checks.filter((check) => check.issues.length > 0)
  if (failed.length) {
    console.error(`\n${failed.length} product(s) have issues. See table above for details.`)
    process.exit(1)
  }

  console.log('\nAll product links look good!')
}

main().catch((error) => {
  console.error('Unexpected error while checking product links:', error)
  process.exit(1)
})
