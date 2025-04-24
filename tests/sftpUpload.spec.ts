import { test } from '../fixtures/projectFixtures'; // Use custom fixtures

test.describe('SFTP Service', () => {
  test.skip('should upload a specific text file', async ({ sftpService }) => {
    const localFileNameToUpload = 'test.txt';
    await sftpService.uploadFile(localFileNameToUpload);
  });
});
