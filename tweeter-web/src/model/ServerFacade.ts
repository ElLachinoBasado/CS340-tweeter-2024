import {
  AuthToken,
  FollowRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  User,
  UserItemCountRequest,
  UserItemCountResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://dsmhw19g68.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/authentication/login");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.token);
      if (user === null || authToken === null) {
        throw new Error("User or authToken returned null");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response.message);
      throw new Error("Invalid alias or password");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/authentication/register");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user === null || authToken === null) {
        throw new Error("Invalid registration");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to register");
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/authentication/getUser");

    if (response.success) {
      return User.fromDto(response.user);
    } else {
      console.error(response.message);
      throw new Error("Failed to get user");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/authentication/logout");

    if (response.success) {
      await new Promise((res) => setTimeout(res, 1000));
    } else {
      console.error(response.message);
      throw new Error("Logout failed");
    }
  }

  public async loadMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feedList");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => Status.fromDto(item))
              .filter((status): status is Status => status !== null)
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

  public async loadMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/storyList");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => Status.fromDto(item))
              .filter((status): status is Status => status !== null)
          : [];
        return [items, response.hasMore];
      } else {
        console.error(response.message);
        throw new Error("Server failed to load story items");
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to load story items");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post");

    if (response.success) {
      await new Promise((res) => setTimeout(res, 1000));
    } else {
      console.error(response.message);
      throw new Error("Posting failed");
    }
  }

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
