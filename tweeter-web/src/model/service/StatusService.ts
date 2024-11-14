import {
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
} from "tweeter-shared";
import { ServerFacade } from "../ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.loadMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.loadMoreStoryItems(request);
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    return this.serverFacade.postStatus(request);
  }
}
