import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenters/AppNavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(
      mockAppNavbarPresenterView
    );

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logout(authToken);
    verify(
      mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });

  it("calls logout on the user service", async () => {
    appNavbarPresenter.logout(authToken);
    verify(mockUserService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the user info, and navigate to the login page", async () => {
    await appNavbarPresenter.logout(authToken);
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();

    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the last info message, clear the user info, and navigate to the login page if an error occurs", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logout(authToken);

    // let [capturedErrorMessage] = capture(
    //   mockAppNavbarPresenterView.displayErrorMessage
    // ).last();
    // console.log(capturedErrorMessage);

    verify(
      mockAppNavbarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred`
      )
    ).once();

    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
  });
});
