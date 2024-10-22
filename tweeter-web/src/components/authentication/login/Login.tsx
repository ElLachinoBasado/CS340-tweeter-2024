import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthenticationFields } from "../AuthenticationFields";
import { UserAccessView } from "../../../presenters/UserAccessPresenter";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { useUserAccessListener } from "../UserAccessListenerHook";

interface Props {
  presenterGenerator: (view: UserAccessView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    presenter.userAccountAction(alias, password);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          keyDownFunction={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  const listener = useUserAccessListener();
  const [presenter] = useState(props.presenterGenerator(listener));

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={(rememberMe: boolean) =>
        (presenter.rememberMe = rememberMe)
      }
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
