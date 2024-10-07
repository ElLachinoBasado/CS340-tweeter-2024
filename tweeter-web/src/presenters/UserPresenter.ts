import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserView {
  displayErrorMessage(message: string): void;
  setDisplayedUser(user: User): void;
}

export class UserPresenter {
  private _view: UserView;
  private _userService: UserService;

  public constructor(view: UserView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
  }
}
