import { StatusPresenter, StatusView } from "./StatusPresenter";

export class FeedPresenter extends StatusPresenter {
  public constructor(view: StatusView) {
    super(view);
  }
}
