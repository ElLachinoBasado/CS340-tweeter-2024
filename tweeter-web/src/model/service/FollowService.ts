import {
  AuthToken,
  FakeData,
  FollowRequest,
  FollowResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDTO,
  UserItemCountRequest,
  UserItemCountResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "../ClientCommunicator";

export class FollowService {
  private SERVER_URL =
    "https://dsmhw19g68.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async loadMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => User.fromDto(item))
              .filter((user): user is User => user !== null)
          : [];
        return [items, response.hasMore];
      } else {
        console.error(response.message);
        throw new Error("Server failed to load feed items");
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to load feed items");
    }
  }

  public async loadMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => User.fromDto(item))
              .filter((user): user is User => user !== null)
          : [];
        return [items, response.hasMore];
      } else {
        console.error(response.message);
        throw new Error("Server failed to load feed items");
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to load feed items");
    }
  }

  public async getFollowerCount(
    request: UserItemCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserItemCountRequest,
      UserItemCountResponse
    >(request, "/follower/count");

    if (response.success) {
      const count = response.count;
      return count;
    } else {
      console.error(response.message);
      throw new Error("Server failed to get follower count");
    }
  }

  public async getFolloweeCount(
    request: UserItemCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserItemCountRequest,
      UserItemCountResponse
    >(request, "/followee/count");

    if (response.success) {
      const count = response.count;
      return count;
    } else {
      console.error(response.message);
      throw new Error("Server failed to get followee count");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/isFollower");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response.message);
      throw new Error("Server failed to get is follower status");
    }
  }

  public async follow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/userLink/follow");

    if (response.success) {
      const followerCount = response.followerCount;
      const followeeCount = response.followeeCount;
      return [followerCount, followeeCount];
    } else {
      console.error(response.message);
      throw new Error("Server failed to follow user");
    }
  }

  public async unfollow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/userLink/unfollow");

    if (response.success) {
      const followerCount = response.followerCount;
      const followeeCount = response.followeeCount;
      return [followerCount, followeeCount];
    } else {
      console.error(response.message);
      throw new Error("Server failed to unfollow user");
    }
  }
}
