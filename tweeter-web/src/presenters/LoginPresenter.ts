import { AuthToken, User } from "tweeter-shared";
import { UserAccessPresenter, UserAccessView } from "./UserAccessPresenter";

export class LoginPresenter extends UserAccessPresenter {
  private originalUrl: string | undefined;

  public constructor(view: UserAccessView, originalUrl?: string) {
    super(view);
    this.originalUrl = originalUrl;
  }

  protected getUserInformation(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }

  protected navigateFunction(): void {
    if (!!this.originalUrl) {
      this.view.navigate(this.originalUrl);
    } else {
      this.view.navigate("/");
    }
  }

  protected getActionDescription(): string {
    return "log user in";
  }
}
