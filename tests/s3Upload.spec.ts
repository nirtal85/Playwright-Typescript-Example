import { test } from '../fixtures/projectFixtures';
import { expect } from '@playwright/test';
import * as path from 'path';

test.describe('S3 Service Upload', () => {
  test('should upload the test.txt file to S3', async ({ s3Service }) => {
    const bucketName = process.env.S3_BUCKET_NAME!;
    const localFileName = 'test.txt';
    const localFilePath = path.join(__dirname, '..', 'resources', localFileName);
    const s3Key = `test-uploads/${localFileName}`;
    const uploadResult = await s3Service.uploadFile(bucketName, s3Key, localFilePath);
    expect(uploadResult).toBeDefined();
    expect(uploadResult?.$metadata?.httpStatusCode).toBe(200);
  });
});
