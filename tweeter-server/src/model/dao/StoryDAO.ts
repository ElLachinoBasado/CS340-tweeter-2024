import { StatusDTO, UserDTO } from "tweeter-shared";
import { StoryDAOInterface } from "./StoryDAOInterface";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
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

  public async getStories(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "alias-timestamp-index",
      KeyConditionExpression: `${this.aliasAttribute} = :alias`,
      ExpressionAttributeValues: {
        ":alias": user.alias,
      },
      Limit: pageSize,
    };
    if (lastItem) {
      params.ExclusiveStartKey = {
        [this.aliasAttribute]: lastItem.user.alias,
        [this.timestampAttribute]: lastItem.timestamp,
      };
    }

    const data = await client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    const items: StatusDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        post: item[this.postAttribute],
        user: user,
        timestamp: item[this.timestampAttribute],
        segments: [],
      })
    );

    return [items, hasMorePages];
  }

  public async getAllStories(
    client: DynamoDBDocumentClient,
    user: UserDTO
  ): Promise<StatusDTO[]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "alias-timestamp-index",
      KeyConditionExpression: `${this.aliasAttribute} = :alias`,
      ExpressionAttributeValues: {
        ":alias": user.alias,
      },
    };

    const data = await client.send(new QueryCommand(params));
    const items: StatusDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        post: item[this.postAttribute],
        user: user,
        timestamp: item[this.timestampAttribute],
        segments: [],
      })
    );

    return items;
  }
}
