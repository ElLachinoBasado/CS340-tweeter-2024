import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;
  private currentUser: User;
  private authToken: AuthToken;
  private _isFollower: boolean;
  private _followeeCount: number;
  private _followerCount: number;
  private _isLoading: boolean;

  public constructor(
    view: UserInfoView,
    currentUser: User,
    authToken: AuthToken
  ) {
    super(view);
    this.followService = new FollowService();
    this.currentUser = currentUser;
    this.authToken = authToken;
    this._isFollower = false;
    this._followeeCount = -1;
    this._followerCount = -1;
    this._isLoading = false;
  }

  public async setIsFollowerStatus(displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      if (this.currentUser === displayedUser) {
        this.isFollower = true;
      } else {
        this.isFollower = await this.followService.getIsFollowerStatus(
          this.authToken!,
          this.currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.followService.getFolloweeCount(
        this.authToken!,
        displayedUser
      );
    }, "get followees count");
  }

  public async setNumbFollowers(displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followerCount = await this.followService.getFollowerCount(
        this.authToken!,
        displayedUser
      );
    }, "get followers count");
  }

  public async followDisplayedUser(displayedUser: User) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

        const [followerCount, followeeCount] = await this.followService.follow(
          this.authToken!!,
          displayedUser!
        );

        this.isFollower = true;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "follow user",
      () => {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
      }
    );
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User
  ) {
    event.preventDefault();
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] =
          await this.followService.unfollow(this.authToken!!, displayedUser!);

        this.isFollower = false;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "unfollow user",
      () => {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
      }
    );
  }

  public get isFollower() {
    return this._isFollower;
  }

  private set isFollower(isFollower: boolean) {
    this._isFollower = isFollower;
  }

  public get followeeCount() {
    return this._followeeCount;
  }

  private set followeeCount(followeeCount: number) {
    this._followeeCount = followeeCount;
  }

  public get followerCount() {
    return this._followerCount;
  }

  private set followerCount(followerCount: number) {
    this._followerCount = followerCount;
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
