import { S3Client, PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import * as fs from 'fs';

/**
 * Service for interacting with AWS S3.
 */
export class S3Service {
  private readonly s3Client: S3Client;

  /**
     * Initializes the S3 client.
     * Credentials will be loaded based on the standard AWS credentials chain
     * (environment variables, shared credential file, etc.).
     * @param [region='us-east-1'] - The AWS region to connect to.
     */
  constructor(region: string = 'us-east-1') {
    this.s3Client = new S3Client({ region });
  }

  /**
     * Uploads a local file to an S3 bucket.
     *
     * @param {string} bucketName - The name of the target S3 bucket.
     * @param {string} key - The key (path including filename) for the object in the bucket.
     * @param {string} filePath - The local path to the file to upload.
     * @returns {Promise<PutObjectCommandOutput>} A promise that resolves with the result of the PutObjectCommand.
     * @throws {Error} Throws an error if the upload fails.
     */
  async uploadFile(bucketName: string, key: string, filePath: string): Promise<PutObjectCommandOutput> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileStream
      };
      const command = new PutObjectCommand(uploadParams);
      return await this.s3Client.send(command);
    } catch (err) {
      throw err;
    }
  }
}
