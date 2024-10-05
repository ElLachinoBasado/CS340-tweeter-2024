import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "./UserInfoHook";
import { UserPresenter, UserView } from "../../presenters/UserPresenter";
import { useState } from "react";

interface UserNavigationHook {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

export const useUserNavigation = (): UserNavigationHook => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, currentUser, authToken);
  };

  const listener: UserView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };
  const [presenter] = useState(new UserPresenter(listener));

  return {
    navigateToUser,
  };
};
