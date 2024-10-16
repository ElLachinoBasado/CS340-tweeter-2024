import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfoHook from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { UserAccessView } from "./presenters/UserAccessPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";
import { PagedItemView } from "./presenters/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import { ItemScroller } from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model/service/StatusService";
import { StatusPresenter } from "./presenters/StatusPresenter";
import { StatusItem } from "./components/statusItem/StatusItem";
import { UserItem } from "./components/userItem/UserItem";
import { UserItemPresenter } from "./presenters/UserItemPresenter";
import { FollowService } from "./model/service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfoHook();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService, StatusPresenter>
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              renderItem={(item: Status) => <StatusItem status={item} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService, StatusPresenter>
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              renderItem={(item: Status) => <StatusItem status={item} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService, UserItemPresenter>
              key={3}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              renderItem={(item: User) => <UserItem user={item}/>}      
            />
          }
        />
        <Route
          path="followers"
          element={            
            <ItemScroller<User, FollowService, UserItemPresenter>
              key={4}
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              renderItem={(item: User) => <UserItem user={item}/>}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: UserAccessView) =>
              new LoginPresenter(view)
            }
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: UserAccessView) =>
              new RegisterPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: UserAccessView) =>
              new LoginPresenter(view, location.pathname)
            }
          />
        }
      />
    </Routes>
  );
};

export default App;
