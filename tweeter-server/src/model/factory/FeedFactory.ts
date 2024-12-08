import { StatusDTO, UserDTO } from "tweeter-shared";
import { FeedDAO } from "../dao/FeedDAO";
import { Factory } from "./Factory";

export class FeedFactory extends Factory<FeedDAO> {
  constructor() {
    super();
  }

  protected createDAO() {
    return new FeedDAO();
  }

  public async getFeed(
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    try {
      const [items, hasMore] = await this.DAO.getFeed(
        this.client,
        user,
        pageSize,
        lastItem
      );
      return [items, hasMore];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async addStoriesToFeed(
    followingUser: UserDTO,
    stories: StatusDTO[]
  ): Promise<void> {
    try {
      const promises = stories.map((story) =>
        this.DAO.addStoryToFeed(this.client, followingUser, story)
      );
      await Promise.all(promises);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async removeStoriesFromFeed(
    followingUserAlias: string,
    unfollowedUserAlias: string
  ): Promise<void> {
    try {
      await this.DAO.removeStoriesFromFeed(
        this.client,
        followingUserAlias,
        unfollowedUserAlias
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
