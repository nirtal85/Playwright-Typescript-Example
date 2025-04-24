import SftpClient from 'ssh2-sftp-client';
import path from 'path';

/** Local directory containing resources to upload */
const RESOURCES_DIR = path.resolve(process.cwd(), 'resources');
/** Connection timeout in milliseconds */
const CONNECT_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * SFTP service for uploading and querying files.
 * The default port is 22
 */
export class SftpService {
  private readonly config: SftpClient.ConnectOptions;

  constructor() {
    const host = process.env.SFTP_HOST;
    const username = process.env.SFTP_USER;
    const password = process.env.SFTP_PASSWORD;
    this.config = {
      host,
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
   * Uploads a specified local file from the resources directory to a specified remote directory via SFTP.
   *
   * @param {string} localFileName The name of the file within the local 'resources' directory to upload.
   * @param {string} [remoteDir="/outbound/835"] The remote directory to upload the file to.
   * @returns {Promise<void>} A promise that resolves when the upload is complete.
   * @throws Will propagate any error thrown by the SFTP client
   * (e.g., connection issues, file not found locally, permissions).
   */
  async uploadFile(localFileName: string, remoteDir: string = '/remote/upload'): Promise<void> {
    const localFilePath = path.join(RESOURCES_DIR, localFileName);
    const remoteFilePath = path.posix.join(remoteDir, localFileName);
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
