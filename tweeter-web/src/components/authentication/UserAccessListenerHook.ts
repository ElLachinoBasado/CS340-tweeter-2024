import { useNavigate } from "react-router-dom";
import { UserAccessView } from "../../presenters/UserAccessPresenter";
import useUserInfoHook from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";

export const useUserAccessListener = (): UserAccessView => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  return {
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
  };
};
