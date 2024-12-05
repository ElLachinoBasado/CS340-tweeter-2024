import { DAOInterface } from "./DAOInterface";

export interface FollowsDAOInterface extends DAOInterface {
  getIsFollower(
    client: any,
    follower_handle: string,
    followee_handle: string
  ): Promise<boolean>;

  getFolloweeCount(client: any, follower_handle: string): Promise<number>;
}
