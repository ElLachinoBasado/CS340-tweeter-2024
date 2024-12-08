import { FakeData, UserDTO } from "tweeter-shared";
import { UsersDAOInterface } from "./UsersDAOInterface";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

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

  public async getPassword(
    client: DynamoDBDocumentClient,
    alias: string
  ): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttribute]: alias,
      },
    };
    try {
      const output = await client.send(new GetCommand(params));
      const password = output.Item?.[this.passwordAttribute];
      if (password === undefined) {
        throw new Error("Password not found.");
      }
      return password;
    } catch (error) {
      if (error instanceof Error && error.name === "ItemNotFoundException") {
        console.error("Item not found.");
      }
      throw error;
    }
  }

  public async getUser(
    client: DynamoDBDocumentClient,
    alias: string
  ): Promise<UserDTO | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttribute]: alias,
      },
    };
    try {
      const output = await client.send(new GetCommand(params));
      const user = output.Item;

      if (user === undefined) {
        return null;
      }
      const userDTO: UserDTO = {
        alias: output.Item?.[this.aliasAttribute],
        firstName: output.Item?.[this.firstNameAttribute],
        lastName: output.Item?.[this.lastNameAttribute],
        imageUrl: output.Item?.[this.userImageAttribute],
      };
      return userDTO;
    } catch (error) {
      if (error instanceof Error && error.name === "ItemNotFoundException") {
        console.error("Item not found.");
      }
      throw error;
    }
  }
}
