import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }
}
