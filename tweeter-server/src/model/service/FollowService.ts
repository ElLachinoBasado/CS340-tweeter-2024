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
    // TODO: Replace with the result of calling server
    return this.getFakeUsersData(lastItem, pageSize, user.alias);
  }

  public async loadMoreFollowees(
    token: string,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeUsersData(lastItem, pageSize, user.alias);
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
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
