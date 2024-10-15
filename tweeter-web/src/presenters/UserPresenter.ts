import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserView extends View {
  setDisplayedUser(user: User): void;
}

export class UserPresenter extends Presenter<UserView> {
  private _userService: UserService;

  public constructor(view: UserView) {
    super(view);
    this._userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  protected get userService() {
    return this._userService;
  }
}
