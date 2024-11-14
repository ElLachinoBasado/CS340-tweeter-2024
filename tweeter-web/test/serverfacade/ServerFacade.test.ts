import "isomorphic-fetch";

import {
  RegisterRequest,
  AuthToken,
  User,
  UserItemCountRequest,
  PagedUserItemRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../src/model/ServerFacade";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  it("should register a new user", async () => {
    const request: RegisterRequest = {
      alias: "testuser",
      password: "password",
      firstName: "Test",
      lastName: "User",
      userImageBytes: "15646546515616",
      imageFileExtension: "png",
    };

    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeInstanceOf(User);
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(user.alias).toBe("@allen");
  });

  it("should get followers", async () => {
    const request: PagedUserItemRequest = {
      token: "valid-auth-token",
      userAlias: "@bob",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.loadMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(typeof hasMore).toBe("boolean");
  });

  it("should get follower count", async () => {
    const request: UserItemCountRequest = {
      token: "valid-auth-token",
      user: {
        firstName: "Test",
        lastName: "User",
        alias: "@bob",
        imageUrl: "https://example.com/image.png",
      },
    };

    const followerCount = await serverFacade.getFollowerCount(request);

    expect(typeof followerCount).toBe("number");
  });

  it("should get followee count", async () => {
    const request: UserItemCountRequest = {
      token: "valid-auth-token",
      user: {
        firstName: "Test",
        lastName: "User",
        alias: "@bob",
        imageUrl: "https://example.com/image.png",
      },
    };

    const followeeCount = await serverFacade.getFolloweeCount(request);

    expect(typeof followeeCount).toBe("number");
  });
});
