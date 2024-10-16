import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { InfoMessageView } from "./Presenter";
import { IsLoadingPresenter } from "./IsLoadingPresenter";

export interface PostStatusView extends InfoMessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends IsLoadingPresenter<
  PostStatusView,
  StatusService
> {
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

  protected createService(): StatusService {
    return new StatusService();
  }
}
