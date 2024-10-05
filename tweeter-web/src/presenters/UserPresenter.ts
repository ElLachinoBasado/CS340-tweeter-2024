import { UserService } from "../model/service/UserService";

export interface UserView {}

export abstract class UserPresenter {
  private _view: UserView;
  private _userService: UserService;

  protected constructor(view: UserView) {
    this._view = view;
    this._userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
  }
}
