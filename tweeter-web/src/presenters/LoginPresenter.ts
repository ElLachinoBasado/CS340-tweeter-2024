import { UserAccessPresenter, UserAccessView } from "./UserAccessPresenter";

export class LoginPresenter extends UserAccessPresenter {
  private originalUrl: string | undefined;
  public constructor(view: UserAccessView, originalUrl?: string) {
    super(view);
    this.originalUrl = originalUrl;
  }

  public async userAccountAction(alias: string, password: string) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }
}
