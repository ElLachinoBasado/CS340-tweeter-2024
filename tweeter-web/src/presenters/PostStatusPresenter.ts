import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  displayErrorMessage(message: string): void;
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;
  private _isLoading: boolean = false;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    currentUser: User,
    authToken: AuthToken,
    post: string
  ) {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
