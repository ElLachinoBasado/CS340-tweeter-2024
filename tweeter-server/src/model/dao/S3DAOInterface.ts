import { StatusDTO, UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface S3DAOInterface extends DAOInterface {
  uploadImage(
    client: any,
    fileName: string,
    userImageBytes: string
  ): Promise<string>;
}
