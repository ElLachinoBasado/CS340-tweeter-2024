import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AppNavbarView {
  displayInfoMessage(message: string, duration: number): void;
  displayErrorMessage(message: string): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class AppNavbarPresenter {
  private _view: AppNavbarView;
  private _userService: UserService;

  public constructor(view: AppNavbarView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async logout(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this._userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
  }
}
