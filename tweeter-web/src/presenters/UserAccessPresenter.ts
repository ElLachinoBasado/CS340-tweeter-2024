import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { View } from "./Presenter";
import { IsLoadingPresenter } from "./IsLoadingPresenter";

export interface UserAccessView extends View {
  navigate: NavigateFunction;
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
}

export abstract class UserAccessPresenter extends IsLoadingPresenter<
  UserAccessView,
  UserService
> {
  private _rememberMe: boolean;

  public constructor(view: UserAccessView) {
    super(view);
    this._rememberMe = false;
  }

  public get rememberMe() {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  protected createService(): UserService {
    return new UserService();
  }

  public async userAccountAction(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        const [user, authToken] = await this.getUserInformation(
          alias,
          password,
          firstName,
          lastName,
          imageBytes,
          imageFileExtension
        );
        this.view.updateUserInfo(user, user, authToken, this.rememberMe);
        this.navigateFunction();
      },
      this.getActionDescription(),
      () => {
        this.isLoading = false;
      }
    );
  }

  protected abstract getUserInformation(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]>;

  protected abstract navigateFunction(): void;

  protected abstract getActionDescription(): string;
}
