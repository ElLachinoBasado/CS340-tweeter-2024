import { FakeData, UserDTO } from "tweeter-shared";
import { UsersDAOInterface } from "./UsersDAOInterface";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class UsersDAO implements UsersDAOInterface {
  readonly tableName = "users";
  readonly aliasAttribute = "alias";
  readonly passwordAttribute = "password";
  readonly firstNameAttribute = "firstName";
  readonly lastNameAttribute = "lastName";
  readonly userImageAttribute = "userImage";

  public async register(client: DynamoDBDocumentClient): Promise<UserDTO> {
    const user = FakeData.instance.firstUser!.dto;
    return user;
  }
}
