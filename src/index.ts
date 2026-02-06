/**
 * gawain-amazon-plugin
 * Amazon plugin for Gawain video generation API
 */

// Re-export main modules
export { GawainClient, createConfigFromEnv, type GawainClientConfig } from './gawain/client.js';
export {
  type ProductInput,
  type CreateJobRequest,
  type CreateJobResponse,
  type GetJobResponse,
  type JobStatus,
  GawainApiError,
} from './gawain/types.js';

export {
  getOrCreateInstallId,
  generateInstallId,
  readInstallId,
  writeInstallId,
  buildUpgradeUrl,
} from './install/install_id.js';

export {
  convertAmazonProduct,
  validateAmazonProduct,
  extractAsinFromUrl,
  type AmazonProduct,
  type AmazonImage,
  type AmazonPrice,
  type AmazonVariation,
} from './platform/amazon_adapter.js';

export { loadEnvConfig, maskSecret, type EnvConfig } from './util/env.js';
export { withRetry, sleep, isRetryableError, type RetryOptions } from './util/retry.js';
