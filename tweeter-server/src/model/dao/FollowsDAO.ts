import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowsDAOInterface } from "./FollowsDAOInterface";
import { Select } from "@aws-sdk/client-dynamodb";

export class FollowsDAO implements FollowsDAOInterface {
  readonly followerHandleAttribute = "follower_handle";
  readonly followeeHandleAttribute = "followee_handle";
  readonly tableName = "follows";

  public async getIsFollower(
    client: DynamoDBDocumentClient,
    follower_handle: string,
    followee_handle: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttribute]: follower_handle,
        [this.followeeHandleAttribute]: followee_handle,
      },
    };
    const output = await client.send(new GetCommand(params));
    return output.Item ? true : false;
  }

  public async getFolloweeCount(
    client: DynamoDBDocumentClient,
    follower_handle: string
  ): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: "follower_handle_index",
      KeyConditionExpression: `${this.followerHandleAttribute} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": follower_handle,
      },
      Select: Select.COUNT,
    };
    const output = await client.send(new QueryCommand(params));
    return output.Count || 0;
  }

  public async getFollowerCount(
    client: DynamoDBDocumentClient,
    followee_handle: string
  ): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: "followee_handle_index",
      KeyConditionExpression: `${this.followeeHandleAttribute} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": followee_handle,
      },
      Select: Select.COUNT,
    };
    const output = await client.send(new QueryCommand(params));
    return output.Count || 0;
  }
}
