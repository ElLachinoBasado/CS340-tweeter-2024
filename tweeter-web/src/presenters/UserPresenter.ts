import { AuthToken, GetUserRequest, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserView extends View {
  setDisplayedUser(user: User): void;
}

export class UserPresenter extends Presenter<UserView, UserService> {
  public constructor(view: UserView) {
    super(view);
  }

  public async navigateToUser(
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const request: GetUserRequest = {
        token: authToken?.token!,
        alias: alias,
      };
      const user = await this.service.getUser(request);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  protected createService(): UserService {
    return new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
