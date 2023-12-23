export interface IAwsS3Service {
  upload(fileBuffer: Buffer, originalFileName: string): Promise<any>;
  delete(key: string): Promise<boolean>;
  isExistsFile(key: string): Promise<boolean>;
  getSignedUrl(key: string): Promise<string>;
}
