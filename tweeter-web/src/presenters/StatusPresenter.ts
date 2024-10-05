import { StatusService } from "../model/service/StatusService";

export interface StatusView {}

export abstract class StatusPresenter {
  private _view: StatusView;
  private statusService: StatusService;

  protected constructor(view: StatusView) {
    this._view = view;
    this.statusService = new StatusService();
  }
}
