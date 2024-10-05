import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private _FollowService: FollowService;

  public constructor(view: UserInfoView) {
    this._view = view;
    this._FollowService = new FollowService();
  }
}
