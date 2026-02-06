import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  generateInstallId,
  readInstallId,
  writeInstallId,
  getOrCreateInstallId,
  buildUpgradeUrl,
} from './install_id.js';

describe('install_id', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gawain-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('generateInstallId', () => {
    it('should generate valid UUID v4', () => {
      const id = generateInstallId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique IDs', () => {
      const id1 = generateInstallId();
      const id2 = generateInstallId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('readInstallId / writeInstallId', () => {
    it('should return null when file does not exist', () => {
      const result = readInstallId(tempDir);
      expect(result).toBeNull();
    });

    it('should read written install_id', () => {
      const id = generateInstallId();
      writeInstallId(id, tempDir);
      const result = readInstallId(tempDir);
      expect(result).toBe(id);
    });

    it('should return null for invalid UUID in file', () => {
      const localDir = path.join(tempDir, '.local');
      fs.mkdirSync(localDir, { recursive: true });
      fs.writeFileSync(path.join(localDir, 'install_id'), 'invalid-uuid');
      const result = readInstallId(tempDir);
      expect(result).toBeNull();
    });
  });

  describe('getOrCreateInstallId', () => {
    it('should create new ID if none exists', () => {
      const id = getOrCreateInstallId(tempDir);
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should return existing ID if present', () => {
      const id1 = getOrCreateInstallId(tempDir);
      const id2 = getOrCreateInstallId(tempDir);
      expect(id1).toBe(id2);
    });
  });

  describe('buildUpgradeUrl', () => {
    it('should build URL with install_id parameter', () => {
      const url = buildUpgradeUrl('https://kinosuke.example.com/upgrade', 'test-id-123');
      expect(url).toBe('https://kinosuke.example.com/upgrade?install_id=test-id-123');
    });

    it('should preserve existing query parameters', () => {
      const url = buildUpgradeUrl('https://kinosuke.example.com/upgrade?ref=demo', 'test-id');
      expect(url).toContain('install_id=test-id');
      expect(url).toContain('ref=demo');
    });
  });
});
