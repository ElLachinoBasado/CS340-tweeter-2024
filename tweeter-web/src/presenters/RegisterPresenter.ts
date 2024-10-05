import { UserPresenter, UserView } from "./UserPresenter";

export class RegisterPresenter extends UserPresenter {
  public constructor(view: UserView) {
    super(view);
  }

  public async userAccountAction(
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }
}
