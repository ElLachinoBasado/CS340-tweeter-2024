import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PagedItemView<I> extends View {
  addItems: (items: I[]) => void;
}

// V should be a view
// I should be an item
// S should be a service
export abstract class PagedItemPresenter<
  V extends View,
  I,
  S
> extends Presenter<PagedItemView<I>> {
  private _hasMoreItems = true;
  private _lastItem: I | null = null;
  private _service: S;

  protected constructor(view: PagedItemView<I>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): S;

  protected get service() {
    return this._service;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected set lastItem(value: I | null) {
    this._lastItem = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
