import {
  AuthToken,
  FakeData,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  Status,
} from "tweeter-shared";
import { ClientCommunicator } from "../ClientCommunicator";

export class StatusService {
  private SERVER_URL =
    "https://dsmhw19g68.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  public async loadMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feedList");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => Status.fromDto(item))
              .filter((status): status is Status => status !== null)
          : [];
        return [items, response.hasMore];
      } else {
        console.error(response.message);
        throw new Error("Server failed to load feed items");
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to load feed items");
    }
  }

  public async loadMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/storyList");

    if (response.success) {
      if (response.items) {
        const items = response.items
          ? response.items
              .map((item) => Status.fromDto(item))
              .filter((status): status is Status => status !== null)
          : [];
        return [items, response.hasMore];
      } else {
        console.error(response.message);
        throw new Error("Server failed to load feed items");
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to load feed items");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post");

    if (response.success) {
      await new Promise((res) => setTimeout(res, 1000));
    } else {
      console.error(response.message);
      throw new Error("Posting failed");
    }
  }
}
