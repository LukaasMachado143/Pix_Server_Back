import { IAwsS3Service } from "../Core/Interfaces/Service/IAwsS3Service";
import awsS3Instance from "../ExternalConfigs/awsS3Instance";
import * as AWS from "aws-sdk";
import { hash } from "bcrypt";

export class AwsS3Service implements IAwsS3Service {
  private s3: AWS.S3;
  private bucketName: string = "pix-server";

  constructor() {
    this.s3 = awsS3Instance;
  }
  async getSignedUrl(key: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: 3600, // Tempo de validade em segundos
      };

      const urlAssinada = await this.s3.getSignedUrl("getObject", params);
      return urlAssinada;
    } catch (error) {
      const errorMessage: string = `Erro ao fazer gerar url, ${error}`;
      return errorMessage;
    }
  }

  async upload(fileBuffer: any, originalFileName: string): Promise<any> {
    try {
      const hashKey: string = await hash(originalFileName, 10);
      const fileNameHashed: string = `${hashKey}-${originalFileName}`;
      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: fileNameHashed.replace(/\//g, "_"),
        Body: fileBuffer,
      };

      const uploadedFile = await this.s3.upload(params).promise();
      return {
        key: uploadedFile.Key as string,
      };
    } catch (error) {
      console.error("Erro ao fazer upload para o S3:", error);
      throw new Error("Erro ao fazer upload para o S3.");
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error("Erro ao excluir objeto do S3:", error);
      return false;
    }
  }

  async isExistsFile(key: string): Promise<boolean> {
    try {
      const params: AWS.S3.HeadObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      console.error("Erro ao verificar a existência do objeto no S3:", error);
      return false;
    }
  }
}
