import { FakeData, UserDTO } from "tweeter-shared";
import { UsersDAOInterface } from "./UsersDAOInterface";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export class UsersDAO implements UsersDAOInterface {
  readonly aliasAttribute = "alias";
  readonly passwordAttribute = "password";
  readonly firstNameAttribute = "firstName";
  readonly lastNameAttribute = "lastName";
  readonly userImageAttribute = "userImage";
  readonly tableName = "users";

  public async register(
    client: DynamoDBDocumentClient,
    alias: string,
    firstName: string,
    lastName: string,
    userImage: string,
    hashedPassword: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttribute]: alias,
        [this.passwordAttribute]: hashedPassword,
        [this.firstNameAttribute]: firstName,
        [this.lastNameAttribute]: lastName,
        [this.userImageAttribute]: userImage,
      },
      ConditionExpression: `attribute_not_exists(${this.aliasAttribute})`,
    };

    try {
      await client.send(new PutCommand(params));
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
      ) {
        console.error("Item with the same primary key already exists.");
      } else {
        throw error;
      }
    }
  }
}
