import { StoryDAOInterface } from "./StoryDAOInterface";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export class StoryDAO implements StoryDAOInterface {
  readonly aliasAttribute = "alias";
  readonly timestampAttribute = "timestamp";
  readonly postAttribute = "post";
  readonly tableName = "stories";

  public async postStatus(
    client: DynamoDBDocumentClient,
    post: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttribute]: alias,
        [this.timestampAttribute]: timestamp,
        [this.postAttribute]: post,
      },
    };

    try {
      await client.send(new PutCommand(params));
    } catch (error) {
      throw error;
    }
  }
}
