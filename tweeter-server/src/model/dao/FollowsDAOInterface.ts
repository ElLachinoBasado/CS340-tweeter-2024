import { UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface FollowsDAOInterface extends DAOInterface {
  getIsFollower(
    client: any,
    follower_handle: string,
    followee_handle: string
  ): Promise<boolean>;
  getFolloweeCount(client: any, follower_handle: string): Promise<number>;
  getFollowerCount(client: any, followee_handle: string): Promise<number>;
  follow(client: any, user: UserDTO, userToFollow: UserDTO): Promise<void>;
  unfollow(client: any, user: UserDTO, userToUnfollow: UserDTO): Promise<void>;
  getFollowees(
    client: any,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]>;
  getFollowers(
    client: any,
    user: UserDTO,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]>;
  getAllFollowers(client: any, user: UserDTO): Promise<UserDTO[]>;
}
