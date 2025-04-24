import { test } from '../fixtures/projectFixtures';
import { expect } from '@playwright/test';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('S3 Service Upload', () => {
  test.skip('should upload the test.txt file to S3', async ({ s3Service }) => {
    const localFileName = 'test.txt';
    const bucketName = 'test';
    const localFilePath = path.join(__dirname, '..', 'resources', localFileName);
    const s3Key = `nir/${localFileName}`;
    const uploadResult = await s3Service.uploadFile(bucketName, s3Key, localFilePath);
    expect(uploadResult).toBeDefined();
    expect(uploadResult?.$metadata?.httpStatusCode).toBe(200);
  });
});
