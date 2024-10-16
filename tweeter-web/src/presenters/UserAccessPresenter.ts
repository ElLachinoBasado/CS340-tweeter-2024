import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface UserAccessView extends View {
  navigate: NavigateFunction;
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
}

export abstract class UserAccessPresenter extends Presenter<
  UserAccessView,
  UserService
> {
  private _isLoading: boolean;
  private _rememberMe: boolean;

  protected constructor(view: UserAccessView) {
    super(view);
    this._isLoading = false;
    this._rememberMe = false;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public get rememberMe() {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  protected createService(): UserService {
    return new UserService();
  }

  public abstract userAccountAction(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): void;
}
