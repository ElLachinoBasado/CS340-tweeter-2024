import { StatusDTO, UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface FeedDAOInterface extends DAOInterface {
  getFeed(
    client: any,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;

  addStoryToFeed(
    client: any,
    followingUser: UserDTO,
    story: StatusDTO
  ): Promise<void>;

  removeStoriesFromFeed(
    client: any,
    followingUserAlias: string,
    unfollowedUserAlias: string
  ): Promise<void>;
}
