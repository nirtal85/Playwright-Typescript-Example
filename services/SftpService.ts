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
      const exists = await client.exists(remoteDir);
      if (!exists) {
        throw new Error(`Remote directory '${remoteDir}' does not exist.`);
      }
      await client.put(localFilePath, remoteFilePath);
    });
  }

  /**
   * Counts the number of files in the given remote directory that start with a specified prefix.
   *
   * @param {string} filePrefix The prefix to filter by.
   * @param {string} [remoteDir="/remote/inbox"] The remote directory to search in.
   */
  async countFilesWithPrefix(filePrefix: string, remoteDir: string = '/remote/inbox'): Promise<number> {
    if (!filePrefix) return 0;
    return await this.performSftpAction(async (client) => {
      const dirExists = await client.exists(remoteDir);
      if (!dirExists) return 0;
      let fileList: SftpClient.FileInfo[];
      try {
        fileList = await client.list(remoteDir);
      } catch (error) {
        throw new Error(`Failed to list remote directory '${remoteDir}': ${error instanceof Error ? error.message : String(error)}`);
      }
      return fileList.filter(file => file.type === '-' && file.name.startsWith(filePrefix)).length;
    });
  }
}
