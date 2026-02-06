import { describe, it, expect } from 'vitest';
import {
  convertAmazonProduct,
  validateAmazonProduct,
  extractAsinFromUrl,
  type AmazonProduct,
} from './amazon_adapter.js';

describe('amazon_adapter', () => {
  const sampleProduct: AmazonProduct = {
    asin: 'B0DCPKM21Y',
    title: 'Test Wireless Headphones',
    brand: 'TestBrand',
    bullet_points: [
      '40-hour battery life',
      'Active noise cancellation',
      'Comfortable design',
    ],
    description: 'Premium wireless headphones for audiophiles.',
    images: [
      { url: 'https://example.com/img-main.jpg', variant: 'MAIN' },
      { url: 'https://example.com/img-pt01.jpg', variant: 'PT01' },
      { url: 'https://example.com/img-pt02.jpg', variant: 'PT02' },
    ],
    price: {
      amount: '29800',
      currency: 'JPY',
    },
    variations: [
      { asin: 'B0DCPKM21Y', title: 'Black', dimension: 'color_name' },
      { asin: 'B0DCPKM22Z', title: 'White', dimension: 'color_name' },
    ],
    category: 'Electronics > Headphones',
    features: {
      battery_life: '40 hours',
      connectivity: 'Bluetooth 5.3',
    },
  };

  describe('convertAmazonProduct', () => {
    it('should convert ASIN to product id', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.id).toBe('B0DCPKM21Y');
    });

    it('should convert title', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.title).toBe('Test Wireless Headphones');
    });

    it('should combine bullet points and description', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.description).toContain('40-hour battery life');
      expect(result.description).toContain('Active noise cancellation');
      expect(result.description).toContain('Premium wireless headphones');
    });

    it('should sort images with MAIN first', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.images[0]).toBe('https://example.com/img-main.jpg');
      expect(result.images).toHaveLength(3);
    });

    it('should convert price', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.price).toEqual({ amount: '29800', currency: 'JPY' });
    });

    it('should convert variations', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.variants).toHaveLength(2);
      expect(result.variants?.[0]).toEqual({
        id: 'B0DCPKM21Y',
        title: 'Black',
        price: undefined,
      });
    });

    it('should include metadata with source and ASIN', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.metadata?.source).toBe('amazon');
      expect(result.metadata?.asin).toBe('B0DCPKM21Y');
      expect(result.metadata?.brand).toBe('TestBrand');
      expect(result.metadata?.category).toBe('Electronics > Headphones');
    });

    it('should include features in metadata', () => {
      const result = convertAmazonProduct(sampleProduct);
      expect(result.metadata?.battery_life).toBe('40 hours');
      expect(result.metadata?.connectivity).toBe('Bluetooth 5.3');
    });

    it('should handle product with only bullet points', () => {
      const product: AmazonProduct = {
        asin: 'B0123456789',
        title: 'Test Product',
        bullet_points: ['Feature 1', 'Feature 2'],
      };
      const result = convertAmazonProduct(product);
      expect(result.description).toBe('Feature 1\nFeature 2');
    });

    it('should handle product with only description', () => {
      const product: AmazonProduct = {
        asin: 'B0123456789',
        title: 'Test Product',
        description: 'This is a test product.',
      };
      const result = convertAmazonProduct(product);
      expect(result.description).toBe('This is a test product.');
    });
  });

  describe('validateAmazonProduct', () => {
    it('should return true for valid product', () => {
      expect(validateAmazonProduct(sampleProduct)).toBe(true);
    });

    it('should return false for null', () => {
      expect(validateAmazonProduct(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(validateAmazonProduct('string')).toBe(false);
    });

    it('should return false for missing asin', () => {
      const invalid = { title: 'Test' };
      expect(validateAmazonProduct(invalid)).toBe(false);
    });

    it('should return false for missing title', () => {
      const invalid = { asin: 'B0123456789' };
      expect(validateAmazonProduct(invalid)).toBe(false);
    });

    it('should return false for empty asin', () => {
      const invalid = { asin: '   ', title: 'Test' };
      expect(validateAmazonProduct(invalid)).toBe(false);
    });

    it('should return false for empty title', () => {
      const invalid = { asin: 'B0123456789', title: '   ' };
      expect(validateAmazonProduct(invalid)).toBe(false);
    });
  });

  describe('extractAsinFromUrl', () => {
    it('should extract ASIN from /dp/ URL', () => {
      const url = 'https://www.amazon.com/dp/B0DCPKM21Y';
      expect(extractAsinFromUrl(url)).toBe('B0DCPKM21Y');
    });

    it('should extract ASIN from /gp/product/ URL', () => {
      const url = 'https://www.amazon.co.jp/gp/product/B0DCPKM21Y';
      expect(extractAsinFromUrl(url)).toBe('B0DCPKM21Y');
    });

    it('should extract ASIN from URL with product name', () => {
      const url = 'https://www.amazon.com/Premium-Headphones-Noise-Cancelling/dp/B0DCPKM21Y/ref=sr_1_1';
      expect(extractAsinFromUrl(url)).toBe('B0DCPKM21Y');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://www.amazon.com/about-us';
      expect(extractAsinFromUrl(url)).toBeNull();
    });

    it('should handle lowercase ASIN and convert to uppercase', () => {
      const url = 'https://www.amazon.com/dp/b0dcpkm21y';
      expect(extractAsinFromUrl(url)).toBe('B0DCPKM21Y');
    });
  });
});
