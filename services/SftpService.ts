import SftpClient from 'ssh2-sftp-client';
import path from 'path';

/** Default filename for testing file upload (adjust as needed) */
const DUMMY_FILE_NAME = 'dummy-upload-file.txt';
/** Local directory containing resources to upload */
const RESOURCES_DIR = path.resolve(process.cwd(), 'resources');
/** Connection timeout in milliseconds */
const CONNECT_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * SFTP service for uploading and querying files.
 */
export class SftpService {
  private readonly config: SftpClient.ConnectOptions;

  constructor() {
    const host = process.env.SFTP_HOST;
    const port = 22;
    const username = process.env.SFTP_USER;
    const password = process.env.SFTP_PASSWORD;
    this.config = {
      host,
      port,
      username,
      password,
      readyTimeout: CONNECT_TIMEOUT_MS
    };
  }

  /**
 * Performs a specified SFTP action using a connected SFTP client.
 *
 * @template T - The type of the result returned by the action.
 * @param {(client: SftpClient) => Promise<T>} action - The action to perform, which receives an SFTP client and returns a promise.
 * @returns {Promise<T>} - A promise that resolves with the result of the action.
 * @throws Will propagate any error thrown by the action or connection process.
 */
  private async performSftpAction<T>(action: (client: SftpClient) => Promise<T>): Promise<T> {
    const client = new SftpClient();
    try {
      await client.connect(this.config);
      return await action(client);
    } finally {
      await client.end();
    }
  }

  /**
   * Uploads a local file to a specified remote directory via SFTP.
   *
   * @param {string} [remoteDir="/remote/upload"] The remote directory to upload to. Must already exist on the server.
   * @returns {Promise<void>} A promise that resolves when the upload is complete.
   * @throws Will propagate any error thrown by the SFTP client, such as if the remote directory does not exist.
   */
  async uploadFile(remoteDir: string = '/remote/upload'): Promise<void> {
    const localFilePath = path.join(RESOURCES_DIR, DUMMY_FILE_NAME);
    const remoteFilePath = path.posix.join(remoteDir, DUMMY_FILE_NAME);
    await this.performSftpAction(async (client) => {
      await client.put(localFilePath, remoteFilePath);
    });
  }

  /**
   * Counts how many regular files in the remote directory start with `${filePrefix}-`.
   * This excludes directories and symlinks, ensuring only files are counted.
   *
   * @param {string} filePrefix - The prefix (e.g., user.claimId) to match filenames.
   * @param {string} [remoteDir="/remote/inbox"] - The remote directory to search in.
   * @returns {Promise<number>} - The number of matching regular files.
   */
  async countFilesWithPrefix(filePrefix: string, remoteDir: string = '/remote/inbox'): Promise<number> {
    return await this.performSftpAction(async (client) => {
      const fileList = await client.list(remoteDir);
      return fileList.filter(file =>
        file.type === '-' && file.name.startsWith(`${filePrefix}-`)
      ).length;
    });
  }
}
