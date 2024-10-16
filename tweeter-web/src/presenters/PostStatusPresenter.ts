import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<
  PostStatusView,
  StatusService
> {
  private _isLoading: boolean = false;

  public constructor(view: PostStatusView) {
    super(view);
  }

  public async submitPost(
    currentUser: User,
    authToken: AuthToken,
    post: string
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.service.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
      }
    );
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
