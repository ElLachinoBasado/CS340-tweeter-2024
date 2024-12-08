import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { FollowsDAOInterface } from "./FollowsDAOInterface";
import { Select } from "@aws-sdk/client-dynamodb";
import { UserDTO } from "tweeter-shared";

export class FollowsDAO implements FollowsDAOInterface {
  readonly followerHandleAttribute = "follower_handle";
  readonly followeeHandleAttribute = "followee_handle";
  readonly followerFirstNameAttribute = "follower_first_name";
  readonly followeeFirstNameAttribute = "followee_first_name";
  readonly followerLastNameAttribute = "follower_last_name";
  readonly followeeLastNameAttribute = "followee_last_name";
  readonly followerImageAttribute = "follower_image";
  readonly followeeImageAttribute = "followee_image";
  readonly tableName = "follows";

  public async getFollowers(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "followee_handle_index",
      KeyConditionExpression: `${this.followeeHandleAttribute} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": user.alias,
      },
      Limit: pageSize,
    };
    if (lastItem) {
      params.ExclusiveStartKey = {
        [this.followerHandleAttribute]: lastItem.alias,
        [this.followeeHandleAttribute]: user.alias,
      };
    }

    const data = await client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    const items: UserDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        alias: item[this.followerHandleAttribute],
        firstName: item[this.followerFirstNameAttribute],
        lastName: item[this.followerLastNameAttribute],
        imageUrl: item[this.followerImageAttribute],
      })
    );
    return [items, hasMorePages];
  }

  public async getAllFollowers(
    client: DynamoDBDocumentClient,
    user: UserDTO
  ): Promise<UserDTO[]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "followee_handle_index",
      KeyConditionExpression: `${this.followeeHandleAttribute} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": user.alias,
      },
    };

    const data = await client.send(new QueryCommand(params));
    const items: UserDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        alias: item[this.followerHandleAttribute],
        firstName: item[this.followerFirstNameAttribute],
        lastName: item[this.followerLastNameAttribute],
        imageUrl: item[this.followerImageAttribute],
      })
    );
    return items;
  }

  public async getFollowees(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "follower_handle_index",
      KeyConditionExpression: `${this.followerHandleAttribute} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": user.alias,
      },
      Limit: pageSize,
    };
    if (lastItem) {
      params.ExclusiveStartKey = {
        [this.followerHandleAttribute]: user.alias,
        [this.followeeHandleAttribute]: lastItem.alias,
      };
    }

    const data = await client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    const items: UserDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        alias: item[this.followeeHandleAttribute],
        firstName: item[this.followeeFirstNameAttribute],
        lastName: item[this.followeeLastNameAttribute],
        imageUrl: item[this.followeeImageAttribute],
      })
    );
    return [items, hasMorePages];
  }

  public async follow(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    userToFollow: UserDTO
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttribute]: user.alias,
        [this.followeeHandleAttribute]: userToFollow.alias,
        [this.followerFirstNameAttribute]: user.firstName,
        [this.followeeFirstNameAttribute]: userToFollow.firstName,
        [this.followerLastNameAttribute]: user.lastName,
        [this.followeeLastNameAttribute]: userToFollow.lastName,
        [this.followerImageAttribute]: user.imageUrl,
        [this.followeeImageAttribute]: userToFollow.imageUrl,
      },
    };

    try {
      await client.send(new PutCommand(params));
    } catch (error) {
      throw error;
    }
  }

  public async unfollow(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    userToUnfollow: UserDTO
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttribute]: user.alias,
        [this.followeeHandleAttribute]: userToUnfollow.alias,
      },
    };
    try {
      await client.send(new DeleteCommand(params));
    } catch (error) {
      throw error;
    }
  }

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
