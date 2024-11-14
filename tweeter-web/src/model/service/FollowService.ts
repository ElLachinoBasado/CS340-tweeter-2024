import {
  FollowRequest,
  IsFollowerRequest,
  PagedUserItemRequest,
  User,
  UserItemCountRequest,
} from "tweeter-shared";
import { ServerFacade } from "../ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.loadMoreFollowers(request);
  }

  public async loadMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.loadMoreFollowees(request);
  }

  public async getFollowerCount(
    request: UserItemCountRequest
  ): Promise<number> {
    return this.serverFacade.getFollowerCount(request);
  }

  public async getFolloweeCount(
    request: UserItemCountRequest
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    return this.serverFacade.follow(request);
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    return this.serverFacade.unfollow(request);
  }
}
