import { AuthToken, FakeData, User, UserDTO } from "tweeter-shared";
import { TokensFactory } from "../factory/TokensFactory";
import { FollowFactory } from "../factory/FollowFactory";

export class FollowService {
  followFactory: FollowFactory;
  tokensFactory: TokensFactory;
  constructor() {
    this.followFactory = new FollowFactory();
    this.tokensFactory = new TokensFactory();
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
        // const [items, hasMore] = await this.followFactory.getFollowers(
        //   user,
        //   pageSize,
        //   lastItem
        // );
        // return [items, hasMore];
        return this.getFakeUsersData(lastItem, pageSize, user.alias);
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
        // const [items, hasMore] = await this.followFactory.getFollowees(
        //   user,
        //   pageSize,
        //   lastItem
        // );
        // return [items, hasMore];
        return this.getFakeUsersData(lastItem, pageSize, user.alias);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async getFakeUsersData(
    lastItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
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
        return [followerCount, followeeCount];
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
        return [followerCount, followeeCount];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
