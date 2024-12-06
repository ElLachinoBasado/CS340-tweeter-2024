import { UserDTO } from "tweeter-shared";
import { FollowsDAO } from "../dao/FollowsDAO";
import { Factory } from "./Factory";

export class FollowFactory extends Factory<FollowsDAO> {
  constructor() {
    super();
  }

  protected createDAO() {
    return new FollowsDAO();
  }

  public async getIsFollower(
    follower_handle: string,
    followee_handle: string
  ): Promise<boolean> {
    try {
      const isFollower = await this.DAO.getIsFollower(
        this.client,
        follower_handle,
        followee_handle
      );
      return isFollower;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getFolloweeCount(follower_handle: string): Promise<number> {
    try {
      const followeeCount = await this.DAO.getFolloweeCount(
        this.client,
        follower_handle
      );
      return followeeCount;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getFollowerCount(followee_handle: string): Promise<number> {
    try {
      const followerCount = await this.DAO.getFollowerCount(
        this.client,
        followee_handle
      );
      return followerCount;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async follow(user: UserDTO, userToFollow: UserDTO) {
    try {
      await this.DAO.follow(this.client, user, userToFollow);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async unfollow(user: UserDTO, userToFollow: UserDTO) {
    try {
      await this.DAO.unfollow(this.client, user, userToFollow);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
