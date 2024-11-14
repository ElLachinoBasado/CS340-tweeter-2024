import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("token", 1);
  const user = new User("Helaman", "Sung", "hjsung@byu.edu", "image.png");
  const post = "Hello, world!";

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);

    const presenterSpy = spy(new PostStatusPresenter(mockViewInstance));
    presenter = instance(presenterSpy);

    mockService = mock<StatusService>();
    const mockServiceInstance = instance(mockService);

    when(presenterSpy.service).thenReturn(mockServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await presenter.submitPost(user, authToken, post);
    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
  });

  // it("calls postStatus on the status service with the correct status string and auth token", async () => {
  //   await presenter.submitPost(user, authToken, post);
  //   verify(mockService.postStatus(authToken, anything())).once();
  // });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await presenter.submitPost(user, authToken, post);
    verify(mockView.setPost("")).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockView.clearLastInfoMessage()).once();

    verify(mockView.displayErrorMessage(anything())).never();
  });

  // it("tells the view to display an error message and clear the last info message and does not clear the post or display a status posted message", async () => {
  //   const error = new Error("An error occurred");
  //   when(mockService.postStatus(anything(), anything())).thenThrow(error);
  //   await presenter.submitPost(user, authToken, post);

  //   verify(
  //     mockView.displayErrorMessage(
  //       "Failed to post the status because of exception: an error has occured!"
  //     )
  //   ).once();
  //   verify(mockView.clearLastInfoMessage()).once();
  //   verify(mockView.setPost(anything())).never();
  //   verify(mockView.displayInfoMessage("Status posted!", 0)).never();
  // });
});
