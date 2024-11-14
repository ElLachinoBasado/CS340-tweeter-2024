// import { MemoryRouter } from "react-router-dom";
// import PostStatus from "../../../src/components/postStatus/PostStatus";
// import { render, screen } from "@testing-library/react";
// import React from "react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom";
// import { AuthToken, User } from "tweeter-shared";
// import { instance, mock, verify, when } from "ts-mockito";
// import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
// import useUserInfoHook from "../../../src/components/userInfo/UserInfoHook";

// jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
//   ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
//   __esModule: true,
//   default: jest.fn(),
// }));

// describe("PostStatus Component", () => {
//   const mockUser: User = new User("alias", "firstName", "lastName", "image");
//   const mockAuthToken: AuthToken = new AuthToken("token", Date.now());

//   beforeAll(() => {
//     (useUserInfoHook as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//       authToken: mockAuthToken,
//     });
//   });

//   it("Start with post and clear buttons disabled", async () => {
//     const { postButton, clearButton } = renderPostStatusAndGetElements();

//     expect(postButton).toBeDisabled();
//     expect(clearButton).toBeDisabled();
//   });

//   it("Enable both buttons when text field has text", async () => {
//     const { postField, postButton, clearButton, user } =
//       renderPostStatusAndGetElements();

//     await user.type(postField, "a");

//     expect(postButton).toBeEnabled();
//     expect(clearButton).toBeEnabled();
//   });

//   it("Disables both buttons if text field is cleared", async () => {
//     const { postField, postButton, clearButton, user } =
//       renderPostStatusAndGetElements();

//     await user.type(postField, "a");
//     expect(postButton).toBeEnabled();
//     expect(clearButton).toBeEnabled();

//     await user.clear(postField);
//     expect(postButton).toBeDisabled();
//     expect(clearButton).toBeDisabled();
//   });

//   it("Calls presenter post method with correct parameters when post button is pressed", async () => {
//     const mockPresenter = mock<PostStatusPresenter>();
//     const mockPresenterInstance = instance(mockPresenter);
//     const post = "This is a test post";

//     const { postField, postButton, user } = renderPostStatusAndGetElements(
//       mockPresenterInstance
//     );

//     await user.type(postField, post);
//     await user.click(postButton);

//     verify(mockPresenter.submitPost(mockUser, mockAuthToken, post)).once();
//   });

//   const renderPostStatus = (presenter?: PostStatusPresenter) => {
//     return render(
//       <MemoryRouter>
//         {!!presenter ? (
//           <PostStatus optionalpresenter={presenter} />
//         ) : (
//           <PostStatus />
//         )}
//       </MemoryRouter>
//     );
//   };

//   const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
//     const user = userEvent.setup();
//     renderPostStatus(presenter);

//     const postField = screen.getByLabelText("postField");
//     const postButton = screen.getByLabelText("postStatusButton");
//     const clearButton = screen.getByLabelText("clearStatusButton");

//     return { user, postField, postButton, clearButton };
//   };
// });
