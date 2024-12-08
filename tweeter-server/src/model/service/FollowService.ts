import { AuthToken, FakeData, StatusDTO, User, UserDTO } from "tweeter-shared";
import { TokensFactory } from "../factory/TokensFactory";
import { FollowFactory } from "../factory/FollowFactory";
import { StoryFactory } from "../factory/StoryFactory";
import { FeedFactory } from "../factory/FeedFactory";

export class FollowService {
  followFactory: FollowFactory;
  tokensFactory: TokensFactory;
  storyFactory: StoryFactory;
  feedFactory: FeedFactory;

  constructor() {
    this.followFactory = new FollowFactory();
    this.tokensFactory = new TokensFactory();
    this.storyFactory = new StoryFactory();
    this.feedFactory = new FeedFactory();
  }

  public async loadMoreFollowers(
    token: string,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        const [items, hasMore] = await this.followFactory.getFollowers(
          user,
          pageSize,
          lastItem
        );
        return [items, hasMore];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async loadMoreFollowees(
    token: string,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        const [items, hasMore] = await this.followFactory.getFollowees(
          user,
          pageSize,
          lastItem
        );
        return [items, hasMore];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      }
      const followerCount = await this.followFactory.getFollowerCount(
        user.alias
      );
      return followerCount;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      }
      const followeeCount = await this.followFactory.getFolloweeCount(
        user.alias
      );
      return followeeCount;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      }
      const isFollower = await this.followFactory.getIsFollower(
        user.alias,
        selectedUser.alias
      );
      return isFollower;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async follow(
    token: string,
    user: UserDTO,
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        await this.followFactory.follow(user, userToFollow);
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        await this.addStatusesToFeed(userToFollow, user);
        return [followerCount, followeeCount];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async addStatusesToFeed(
    followedUser: UserDTO,
    followingUser: UserDTO
  ): Promise<void> {
    try {
      const stories = await this.storyFactory.getAllStories(followedUser);
      if (stories.length > 0) {
        await this.feedFactory.addStoriesToFeed(followingUser, stories);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async unfollow(
    token: string,
    user: UserDTO,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        await this.followFactory.unfollow(user, userToUnfollow);
        const followerCount = await this.getFollowerCount(
          token,
          userToUnfollow
        );
        const followeeCount = await this.getFolloweeCount(
          token,
          userToUnfollow
        );
        await this.removeStatusesFromFeed(userToUnfollow, user);
        return [followerCount, followeeCount];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async removeStatusesFromFeed(
    unfollowedUser: UserDTO,
    followingUser: UserDTO
  ): Promise<void> {
    try {
      await this.feedFactory.removeStoriesFromFeed(
        followingUser.alias,
        unfollowedUser.alias
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
