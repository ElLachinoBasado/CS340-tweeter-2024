// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom";
// import Login from "../../../../src/components/authentication/login/Login";
// import { MemoryRouter } from "react-router-dom";
// import { UserAccessView } from "../../../../src/presenters/UserAccessPresenter";
// import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
// import React from "react";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { instance, mock, verify, when } from "ts-mockito";

// library.add(fab);

// describe("Login Component", () => {
//   it("start with the sign-in button disabled", () => {
//     const { signInButton } = renderLoginAndGetElement("/");

//     expect(signInButton).toBeDisabled();
//   });

//   it("enable sign in button when both alias and password fields have text", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElement("/");

//     await user.type(aliasField, "a");
//     await user.type(passwordField, "b");

//     expect(signInButton).toBeEnabled();
//   });

//   it("disables sign in button if either field is cleared", async () => {
//     const { signInButton, aliasField, passwordField, user } =
//       renderLoginAndGetElement("/");

//     await user.type(aliasField, "a");
//     await user.type(passwordField, "b");
//     expect(signInButton).toBeEnabled();

//     await user.clear(aliasField);
//     expect(signInButton).toBeDisabled();

//     await user.type(aliasField, "a");
//     expect(signInButton).toBeEnabled();

//     await user.clear(passwordField);
//     expect(signInButton).toBeDisabled();
//   });

//   it("calls presenter login method with correct parameters when sign-in button is pressed", async () => {
//     const mockPresenter = mock(LoginPresenter);
//     const alias = "alias";
//     const password = "password";

//     when(mockPresenter.userAccountAction(alias, password)).thenResolve();

//     render(
//       <MemoryRouter>
//         <Login presenterGenerator={() => instance(mockPresenter)} />
//       </MemoryRouter>
//     );

//     const aliasField = screen.getByLabelText("alias");
//     const passwordField = screen.getByLabelText("password");
//     const signInButton = screen.getByRole("button", { name: /Sign in/i });

//     await userEvent.type(aliasField, alias);
//     await userEvent.type(passwordField, password);
//     await userEvent.click(signInButton);

//     verify(mockPresenter.userAccountAction(alias, password)).once();
//   });
// });

// const renderLogin = (originalUrl: string) => {
//   return render(
//     <MemoryRouter>
//       <Login
//         presenterGenerator={(view: UserAccessView) =>
//           new LoginPresenter(view, originalUrl)
//         }
//       />
//     </MemoryRouter>
//   );
// };

// const renderLoginAndGetElement = (originalUrl: string) => {
//   const user = userEvent.setup();

//   renderLogin(originalUrl);

//   const signInButton = screen.getByRole("button", { name: /Sign in/i });
//   const aliasField = screen.getByLabelText("alias");
//   const passwordField = screen.getByLabelText("password");

//   return { signInButton, aliasField, passwordField, user };
// };
