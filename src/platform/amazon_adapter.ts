/**
 * Amazon platform adapter
 * Converts Amazon product data to Gawain format
 */

import type { ProductInput } from '../gawain/types.js';

/**
 * Amazon product image structure
 */
export interface AmazonImage {
  url: string;
  variant?: string;
  width?: number;
  height?: number;
}

/**
 * Amazon product price structure
 */
export interface AmazonPrice {
  amount: string;
  currency: string;
}

/**
 * Amazon product variation structure
 */
export interface AmazonVariation {
  asin: string;
  title: string;
  dimension?: string;
  price?: AmazonPrice;
  availability?: string;
}

/**
 * Amazon product structure
 * Based on Amazon SP-API catalog items format
 */
export interface AmazonProduct {
  asin: string;
  title: string;
  brand?: string;
  bullet_points?: string[];
  description?: string;
  images?: AmazonImage[];
  price?: AmazonPrice;
  variations?: AmazonVariation[];
  category?: string;
  features?: Record<string, string>;
}

/**
 * Convert Amazon product to Gawain ProductInput
 */
export function convertAmazonProduct(product: AmazonProduct): ProductInput {
  // Build description from bullet points and description
  let description = '';
  if (product.bullet_points && product.bullet_points.length > 0) {
    description = product.bullet_points.join('\n');
  }
  if (product.description) {
    if (description) {
      description += '\n\n' + product.description;
    } else {
      description = product.description;
    }
  }

  // Extract image URLs, sorted by variant (MAIN first)
  const images = (product.images || [])
    .sort((a, b) => {
      // MAIN variant should come first
      if (a.variant === 'MAIN') return -1;
      if (b.variant === 'MAIN') return 1;
      // Then sort by variant name
      return (a.variant || '').localeCompare(b.variant || '');
    })
    .map((img) => img.url);

  // Convert variations to Gawain format
  const variants = product.variations?.map((v) => ({
    id: v.asin,
    title: v.title,
    price: v.price?.amount,
  }));

  // Build features metadata
  const featuresMetadata: Record<string, string> = {};
  if (product.features) {
    Object.entries(product.features).forEach(([key, value]) => {
      featuresMetadata[key] = value;
    });
  }

  return {
    id: product.asin,
    title: product.title,
    description: description || undefined,
    images,
    price: product.price
      ? {
          amount: product.price.amount,
          currency: product.price.currency,
        }
      : undefined,
    variants,
    metadata: {
      source: 'amazon',
      asin: product.asin,
      brand: product.brand,
      category: product.category,
      ...featuresMetadata,
    },
  };
}

/**
 * Validate Amazon product has required fields
 */
export function validateAmazonProduct(product: unknown): product is AmazonProduct {
  if (!product || typeof product !== 'object') {
    return false;
  }

  const p = product as Record<string, unknown>;

  // Required: ASIN
  if (typeof p.asin !== 'string' || !p.asin.trim()) {
    return false;
  }

  // Required: title
  if (typeof p.title !== 'string' || !p.title.trim()) {
    return false;
  }

  // Validate ASIN format (10 alphanumeric characters, starts with B0 for products)
  const asin = p.asin as string;
  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    console.warn(`Invalid ASIN format: ${asin}`);
  }

  // Images should have at least one
  if (Array.isArray(p.images) && p.images.length === 0) {
    console.warn('Product has no images');
  }

  return true;
}

/**
 * Extract ASIN from Amazon product URL
 */
export function extractAsinFromUrl(url: string): string | null {
  // Match patterns like:
  // https://www.amazon.com/dp/B0DCPKM21Y
  // https://www.amazon.co.jp/gp/product/B0DCPKM21Y
  // https://www.amazon.com/Product-Name/dp/B0DCPKM21Y/
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  return null;
}
