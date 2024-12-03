import { S3DAO } from "../dao/S3DAO";
import { S3Client } from "@aws-sdk/client-s3";
import { Factory } from "./Factory";

export class S3DAOFactory extends Factory<S3DAO> {
  readonly S3Client: S3Client;

  constructor() {
    super();
    this.S3Client = new S3Client({});
  }

  public async uploadImage(
    fileName: string,
    userImageBytes: string
  ): Promise<string> {
    const url = await this.DAO.uploadImage(
      this.S3Client,
      fileName,
      userImageBytes
    );

    return url;
  }

  protected createDAO() {
    return new S3DAO();
  }
}
