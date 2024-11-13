import { AuthToken, PagedStatusItemRequest, Status } from "tweeter-shared";
import { StatusPresenter } from "./StatusPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem?.dto ?? null,
    };
    return this.service.loadMoreStoryItems(request);
  }

  protected getItemDescription(): string {
    return "load story items";
  }
}
