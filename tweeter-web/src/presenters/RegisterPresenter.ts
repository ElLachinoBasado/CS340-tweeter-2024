import { UserPresenter, UserView } from "./UserPresenter";

export class RegisterPresenter extends UserPresenter {
  public constructor(view: UserView) {
    super(view);
  }
}
