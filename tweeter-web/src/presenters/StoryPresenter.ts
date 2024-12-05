import {
  AuthToken,
  PagedStatusItemRequest,
  Status,
  UserDTO,
} from "tweeter-shared";
import { StatusPresenter } from "./StatusPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: UserDTO
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      user: user,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem?.dto ?? null,
    };
    return this.service.loadMoreStoryItems(request);
  }

  protected getItemDescription(): string {
    return "load story items";
  }
}
