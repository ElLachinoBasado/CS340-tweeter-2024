import {
  AuthToken,
  FakeData,
  Status,
  StatusDTO,
  UserDTO,
} from "tweeter-shared";
import { StoryFactory } from "../factory/StoryFactory";
import { TokensFactory } from "../factory/TokensFactory";
import { FeedFactory } from "../factory/FeedFactory";

export class StatusService {
  storyFactory: StoryFactory;
  tokensFactory: TokensFactory;
  feedFactory: FeedFactory;
  constructor() {
    this.storyFactory = new StoryFactory();
    this.tokensFactory = new TokensFactory();
    this.feedFactory = new FeedFactory();
  }
  public async loadMoreFeedItems(
    token: string,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);
      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        const [items, hasMore] = await this.feedFactory.getFeed(
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

  public async loadMoreStoryItems(
    token: string,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    try {
      const isExpired = await this.tokensFactory.checkToken(token, user.alias);

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        const [items, hasMore] = await this.storyFactory.getStories(
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

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    try {
      const isExpired = await this.tokensFactory.checkToken(
        token,
        newStatus.user.alias
      );

      if (isExpired) {
        throw new Error("Logout and login again");
      } else {
        await this.storyFactory.postStatus(
          newStatus.post,
          newStatus.timestamp,
          newStatus.user.alias
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
