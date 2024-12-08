import { UserDTO, StatusDTO } from "tweeter-shared";
import { FeedDAOInterface } from "./FeedDAOInterface";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

export class FeedDAO implements FeedDAOInterface {
  readonly tableName = "feed";
  readonly followerAliasAttribute = "follower_alias";
  readonly followeeAliasAttribute = "followee_alias";
  readonly timestampAttribute = "timestamp";
  readonly sortKeyAttribute = "sort_key";
  readonly postAttribute = "post";

  public async getFeed(
    client: DynamoDBDocumentClient,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "follower_alias-sort_key-index",
      KeyConditionExpression: `${this.followerAliasAttribute} = :follower_alias`,
      ExpressionAttributeValues: {
        ":follower_alias": user.alias,
      },
      Limit: pageSize,
    };
    if (lastItem) {
      const sortKey = lastItem.timestamp + "_" + lastItem.user.alias;
      params.ExclusiveStartKey = {
        [this.followerAliasAttribute]: user.alias,
        [this.sortKeyAttribute]: sortKey,
      };
    }

    const data = await client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    const items: StatusDTO[] = [];
    data.Items?.forEach((item) =>
      items.push({
        post: item[this.postAttribute],
        timestamp: item[this.timestampAttribute],
        user: item[this.followeeAliasAttribute],
        segments: [],
      })
    );

    return [items, hasMorePages];
  }

  public async addStoryToFeed(
    client: DynamoDBDocumentClient,
    followingUser: UserDTO,
    story: StatusDTO
  ): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.followerAliasAttribute]: followingUser.alias,
          [this.sortKeyAttribute]: story.timestamp + "_" + story.user.alias,
          [this.followeeAliasAttribute]: story.user.alias,
          [this.timestampAttribute]: story.timestamp,
          [this.postAttribute]: story.post,
        },
        ConditionExpression: `attribute_not_exists(${this.sortKeyAttribute}) AND attribute_not_exists(${this.followerAliasAttribute})`,
      };
      await client.send(new PutCommand(params));
    } catch (error) {
      throw error;
    }
  }

  public async removeStoriesFromFeed(
    client: DynamoDBDocumentClient,
    followingUserAlias: string,
    unfollowedUserAlias: string
  ): Promise<void> {
    try {
      const queryParams: QueryCommandInput = {
        TableName: this.tableName,
        IndexName: "follower_alias-followee_alias-index",
        KeyConditionExpression: `${this.followerAliasAttribute} = :follower_alias AND ${this.followeeAliasAttribute} = :followee_alias`,
        ExpressionAttributeValues: {
          ":follower_alias": followingUserAlias,
          ":followee_alias": unfollowedUserAlias,
        },
      };

      const queryData = await client.send(new QueryCommand(queryParams));
      const items = queryData.Items;

      if (items) {
        const deletePromises = items.map((item) => {
          const deleteParams = {
            TableName: this.tableName,
            Key: {
              [this.followerAliasAttribute]: item[this.followerAliasAttribute],
              [this.sortKeyAttribute]: item[this.sortKeyAttribute],
            },
          };
          return client.send(new DeleteCommand(deleteParams));
        });

        await Promise.all(deletePromises);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
