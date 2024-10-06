import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  displayErrorMessage(message: string): void;
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  setIsLoading(isLoading: boolean): void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private followService: FollowService;
  private currentUser: User;
  private authToken: AuthToken;
  private setIsFollower: (isFollower: boolean) => void;
  private setFolloweeCount: (followeeCount: number) => void;
  private setFollowerCount: (followerCount: number) => void;

  public constructor(
    view: UserInfoView,
    currentUser: User,
    authToken: AuthToken,
    setIsFollower: (isFollower: boolean) => void,
    setFolloweeCount: (followeeCount: number) => void,
    setFollowerCount: (followerCount: number) => void
  ) {
    this.view = view;
    this.followService = new FollowService();
    this.currentUser = currentUser;
    this.authToken = authToken;
    this.setIsFollower = setIsFollower;
    this.setFolloweeCount = setFolloweeCount;
    this.setFollowerCount = setFollowerCount;
  }

  public async setIsFollowerStatus(displayedUser: User) {
    try {
      if (this.currentUser === displayedUser) {
        this.setIsFollower(false);
      } else {
        this.setIsFollower(
          await this.followService.getIsFollowerStatus(
            this.authToken!,
            this.currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(displayedUser: User) {
    try {
      this.setFolloweeCount(
        await this.followService.getFolloweeCount(
          this.authToken!,
          displayedUser
        )
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(displayedUser: User) {
    try {
      this.setFollowerCount(
        await this.followService.getFollowerCount(
          this.authToken!,
          displayedUser
        )
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User
  ) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        this.authToken!!,
        displayedUser!
      );

      this.setIsFollower(true);
      this.setFollowerCount(followerCount);
      this.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User
  ) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        this.authToken!!,
        displayedUser!
      );

      this.setIsFollower(false);
      this.setFollowerCount(followerCount);
      this.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
