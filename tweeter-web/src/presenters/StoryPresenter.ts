import { StatusPresenter, StatusView } from "./StatusPresenter";

export class StoryPresenter extends StatusPresenter {
  public constructor(view: StatusView) {
    super(view);
  }
}
