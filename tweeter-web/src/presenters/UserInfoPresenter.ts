import {
  AuthToken,
  FollowRequest,
  IsFollowerRequest,
  User,
  UserItemCountRequest,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { InfoMessagePresenter, InfoMessageView } from "./InfoMessagePresenter";

export class UserInfoPresenter extends InfoMessagePresenter<
  InfoMessageView,
  FollowService
> {
  private currentUser: User;
  private authToken: AuthToken;
  private _followeeCount: number;
  private _followerCount: number;

  public constructor(
    view: InfoMessageView,
    currentUser: User,
    authToken: AuthToken
  ) {
    super(view);
    this.currentUser = currentUser;
    this.authToken = authToken;
    this._followeeCount = -1;
    this._followerCount = -1;
  }

  public async setIsFollowerStatus(
    displayedUser: User,
    setIsFollower: (isFollower: boolean) => void
  ) {
    this.doFailureReportingOperation(async () => {
      if (this.currentUser === displayedUser) {
        setIsFollower(true);
      } else {
        const request: IsFollowerRequest = {
          token: this.authToken.token,
          user: this.currentUser.dto,
          selectedUser: displayedUser.dto,
        };
        const isFollower = await this.service.getIsFollowerStatus(request);
        setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(
    displayedUser: User,
    setFolloweeCount: (count: number) => void
  ) {
    this.doFailureReportingOperation(async () => {
      const request: UserItemCountRequest = {
        token: this.authToken.token,
        user: displayedUser.dto,
      };
      const count = await this.service.getFolloweeCount(request);
      this.followeeCount = count;
      setFolloweeCount(count);
    }, "get followees count");
  }

  public async setNumbFollowers(
    displayedUser: User,
    setFollowerCount: (count: number) => void
  ) {
    this.doFailureReportingOperation(async () => {
      const request: UserItemCountRequest = {
        token: this.authToken.token,
        user: displayedUser.dto,
      };
      const count = await this.service.getFollowerCount(request);
      this.followerCount = count;
      setFollowerCount(count);
    }, "get followers count");
  }

  public async followDisplayedUser(
    displayedUser: User,
    isFollower: boolean,
    setFollowerCount: (count: number) => void,
    setFolloweeCount: (count: number) => void,
    setIsFollower: (isFollower: boolean) => void
  ) {
    await this.handleDisplayedUserFollowUpdate(
      displayedUser,
      "Following",
      "follow user",
      isFollower,
      this.service.follow.bind(this.service),
      setFollowerCount,
      setFolloweeCount,
      setIsFollower
    );
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    isFollower: boolean,
    setFollowerCount: (count: number) => void,
    setFolloweeCount: (count: number) => void,
    setIsFollower: (isFollower: boolean) => void
  ) {
    await this.handleDisplayedUserFollowUpdate(
      displayedUser,
      "Unfollowing",
      "unfollow user",
      isFollower,
      this.service.unfollow.bind(this.service),
      setFollowerCount,
      setFolloweeCount,
      setIsFollower
    );
  }

  protected async handleDisplayedUserFollowUpdate(
    displayedUser: User,
    followMessage: string,
    failMessage: string,
    followerStatus: boolean,
    followOperation: (request: FollowRequest) => Promise<[number, number]>,
    setFollowerCount: (count: number) => void,
    setFolloweeCount: (count: number) => void,
    setIsFollower: (isFollower: boolean) => void
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(
          `${followMessage} ${displayedUser!.name}...`,
          0
        );

        const request: FollowRequest = {
          token: this.authToken.token,
          firstUser: this.currentUser.dto,
          secondUser: displayedUser.dto,
        };

        const [followerCount, followeeCount] = await followOperation(request);

        setFollowerCount(followerCount);
        setFolloweeCount(followeeCount);
        setIsFollower(!followerStatus);
      },
      failMessage,
      () => this.finallyClearInfoMessage()
    );
  }

  protected createService(): FollowService {
    return new FollowService();
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
}
