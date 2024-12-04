import { AuthTokenDTO } from "tweeter-shared";
import { TokensDAOInterface } from "./TokensDAOInterface";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export class TokensDAO implements TokensDAOInterface {
  readonly tokenAttribute: string = "authToken";
  readonly timestampAttribute: string = "timestamp";
  readonly aliasAttribute: string = "alias";
  readonly tableName: string = "authTokens";

  public async createToken(
    client: any,
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttribute]: token,
        [this.timestampAttribute]: timestamp,
        [this.aliasAttribute]: alias,
      },
      ConditionExpression: `attribute_not_exists(${this.tokenAttribute})`,
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

  public async checkToken(
    client: any,
    token: string,
    alias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttribute]: token,
        [this.aliasAttribute]: alias,
      },
    };
    try {
      const output = await client.send(new GetCommand(params));
      const timestamp = output.Item?.[this.timestampAttribute];
      return this.isTimestampExpired(timestamp);
    } catch (error) {
      if (error instanceof Error && error.name === "ItemNotFoundException") {
        console.error("Item not found.");
        return false;
      }
      throw error;
    }
  }

  private isTimestampExpired(timestamp: number): boolean {
    return Date.now() > timestamp;
  }
}
