import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView, UserService> {
  public constructor(view: AppNavbarView) {
    super(view);
  }

  public async logout(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0); // This was not originally in the try catch, so I left it out of doFailureReportingOperation.
    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }

  protected createService(): UserService {
    return new UserService();
  }
}
