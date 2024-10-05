import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface StatusView {
  addItems(newItems: Status[]): void;
  displayErrorMessage(message: string): void;
}

export abstract class StatusPresenter {
  private _view: StatusView;
  private _statusService: StatusService;
  private _lastItem: Status | null = null;
  private _hasMoreItems = true;

  protected constructor(view: StatusView) {
    this._view = view;
    this._statusService = new StatusService();
  }

  protected get view() {
    return this._view;
  }

  protected get statusService() {
    return this._statusService;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
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

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
