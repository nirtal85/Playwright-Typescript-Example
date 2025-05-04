import {test} from '../fixtures/projectFixtures';

test.describe('SFTP Service', () => {
  test.skip('should upload a specific text file', async ({ sftpService }) => {
    const localFileNameToUpload = 'test.txt';
    await sftpService.uploadFile(localFileNameToUpload);
  });
});
