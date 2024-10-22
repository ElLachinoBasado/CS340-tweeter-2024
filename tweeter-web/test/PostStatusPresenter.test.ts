import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../src/presenters/PostStatusPresenter";
import { instance, mock, spy, verify, when } from "ts-mockito";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockStatus: StatusService;

  const authToken = new AuthToken("token", Date.now());
  const user = new User("Helaman", "Sung", "hjsung@byu.edu", "image.png");
  const post = "Hello, world!";

  beforeEach(() => {});

  // it("tells the view to display a posting status message", async () => {});

  //   it("calls postStatus on the status service with the correct status string and auth token", async () => {});

  //   it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {});

  //   it("tells the view to display an error message and clear the last info message and does not clear the post or display a status posted message", async () => {});
});
