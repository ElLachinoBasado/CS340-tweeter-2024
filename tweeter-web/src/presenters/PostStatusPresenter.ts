import { AuthToken, PostStatusRequest, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { InfoMessagePresenter, InfoMessageView } from "./InfoMessagePresenter";

export interface PostStatusView extends InfoMessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends InfoMessagePresenter<
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

        const request: PostStatusRequest = {
          token: authToken.token,
          newStatus: status.dto,
        };
        await this.service.postStatus(request);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => this.finallyClearInfoMessage()
    );
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
