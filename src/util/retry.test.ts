import { describe, it, expect, vi } from 'vitest';
import { calculateBackoff, isRetryableError, withRetry } from './retry.js';

describe('calculateBackoff', () => {
  it('should calculate exponential backoff', () => {
    const options = {
      maxAttempts: 5,
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      jitterFactor: 0, // No jitter for predictable testing
    };

    expect(calculateBackoff(0, options)).toBe(1000);
    expect(calculateBackoff(1, options)).toBe(2000);
    expect(calculateBackoff(2, options)).toBe(4000);
    expect(calculateBackoff(3, options)).toBe(8000);
  });

  it('should cap at maxDelayMs', () => {
    const options = {
      maxAttempts: 5,
      baseDelayMs: 1000,
      maxDelayMs: 5000,
      jitterFactor: 0,
    };

    expect(calculateBackoff(10, options)).toBe(5000);
  });
});

describe('isRetryableError', () => {
  it('should return true for 429', () => {
    expect(isRetryableError(429)).toBe(true);
  });

  it('should return true for 5xx errors', () => {
    expect(isRetryableError(500)).toBe(true);
    expect(isRetryableError(502)).toBe(true);
    expect(isRetryableError(503)).toBe(true);
  });

  it('should return false for 4xx errors (except 429)', () => {
    expect(isRetryableError(400)).toBe(false);
    expect(isRetryableError(401)).toBe(false);
    expect(isRetryableError(404)).toBe(false);
  });
});

describe('withRetry', () => {
  it('should return result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable error', async () => {
    const error = { statusCode: 500, message: 'Server error' };
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success');

    const result = await withRetry(fn, { baseDelayMs: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on non-retryable error', async () => {
    const error = { statusCode: 400, message: 'Bad request' };
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
