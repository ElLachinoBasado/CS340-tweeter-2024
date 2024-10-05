import { AuthToken } from "tweeter-shared";
import { StatusPresenter, StatusView } from "./StatusPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusPresenter {
  public constructor(view: StatusView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load story items because of exception: ${error}`
      );
    }
  }
}
