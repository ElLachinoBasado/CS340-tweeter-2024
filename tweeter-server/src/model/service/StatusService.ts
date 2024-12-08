import {
  AuthToken,
  FakeData,
  Follow,
  Status,
  StatusDTO,
  UserDTO,
} from "tweeter-shared";
import { StoryFactory } from "../factory/StoryFactory";
import { TokensFactory } from "../factory/TokensFactory";
import { FeedFactory } from "../factory/FeedFactory";
import { UsersFactory } from "../factory/UsersFactory";
import { FollowFactory } from "../factory/FollowFactory";

export class StatusService {
  storyFactory: StoryFactory;
  tokensFactory: TokensFactory;
  feedFactory: FeedFactory;
  userFactory: UsersFactory;
  followsFactory: FollowFactory;
  constructor() {
    this.storyFactory = new StoryFactory();
    this.tokensFactory = new TokensFactory();
    this.feedFactory = new FeedFactory();
    this.userFactory = new UsersFactory();
    this.followsFactory = new FollowFactory();
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
        const completedStatuses: StatusDTO[] = [];
        for (const feed of items) {
          const user = await this.userFactory.getUser(feed.user.alias);
          if (user) {
            const status: StatusDTO = {
              user: user,
              post: feed.post,
              timestamp: feed.timestamp,
              segments: feed.segments,
            };
            completedStatuses.push(status);
          }
        }
        return [completedStatuses, hasMore];
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
        const followers = await this.followsFactory.getAllFollowers(
          newStatus.user
        );
        await this.feedFactory.addStoryToFollowers(followers, newStatus);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
