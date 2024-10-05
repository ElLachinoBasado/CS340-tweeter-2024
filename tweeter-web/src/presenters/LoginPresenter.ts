import { UserPresenter, UserView } from "./UserPresenter";

export class LoginPresenter extends UserPresenter {
  public constructor(view: UserView) {
    super(view);
  }
}
