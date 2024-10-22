import { Presenter, View } from "./Presenter";

export abstract class IsLoadingPresenter<V extends View, S> extends Presenter<
  V,
  S
> {
  private _isLoading: boolean;

  public constructor(view: V) {
    super(view);
    this._isLoading = false;
  }

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
