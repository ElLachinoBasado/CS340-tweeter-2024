import { AuthToken, LogoutRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter } from "./Presenter";
import { InfoMessageView } from "./InfoMessagePresenter";

export interface AppNavbarView extends InfoMessageView {
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView, UserService> {
  public constructor(view: AppNavbarView) {
    super(view);
  }

  public async logout(authToken: AuthToken, alias: string) {
    this.view.displayInfoMessage("Logging Out...", 0); // This was not originally in the try catch, so I left it out of doFailureReportingOperation.
    this.doFailureReportingOperation(async () => {
      const request: LogoutRequest = {
        token: authToken.token,
        alias: alias,
      };
      await this.service.logout(request);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }

  protected createService(): UserService {
    return new UserService();
  }
}
