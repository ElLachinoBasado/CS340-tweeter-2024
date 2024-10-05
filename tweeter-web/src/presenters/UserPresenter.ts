import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface UserView {
  navigate: NavigateFunction;
  displayErrorMessage(message: string): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
}

export abstract class UserPresenter {
  private _view: UserView;
  private _userService: UserService;
  private _isLoading: boolean;
  private _rememberMe: boolean;

  protected constructor(view: UserView) {
    this._view = view;
    this._userService = new UserService();
    this._isLoading = false;
    this._rememberMe = false;
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
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

  public abstract userAccountAction(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): void;
}
