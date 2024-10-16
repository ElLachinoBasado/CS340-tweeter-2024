import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<I> extends View {
  addItems: (items: I[]) => void;
}

// I should be an item
// S should be a service
export abstract class PagedItemPresenter<I, S> extends Presenter<
  PagedItemView<I>,
  S
> {
  private _hasMoreItems = true;
  private _lastItem: I | null = null;

  public constructor(view: PagedItemView<I>) {
    super(view);
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: I | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[I[], boolean]>;

  protected abstract getItemDescription(): string;
}
