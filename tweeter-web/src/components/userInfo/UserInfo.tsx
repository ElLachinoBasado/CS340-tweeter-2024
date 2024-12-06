import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "./UserInfoHook";
import { UserInfoPresenter } from "../../presenters/UserInfoPresenter";
import { InfoMessageView } from "../../presenters/InfoMessagePresenter";
import { FollowButton } from "./FollowButton";

const UserInfo = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfoHook();

  const [followeeCount, setFolloweeCount] = useState<number>(-1);
  const [followerCount, setFollowerCount] = useState<number>(-1);
  const [isFollower, setIsFollower] = useState<boolean>(false);

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    async function fetchData() {
      if (displayedUser) {
        await setIsFollowerStatus(displayedUser);
        await setNumbFollowees(displayedUser);
        await setNumbFollowers(displayedUser);
      }
    }
    fetchData();
  }, [displayedUser]);

  const setIsFollowerStatus = async (displayedUser: User) => {
    await presenter.setIsFollowerStatus(displayedUser, setIsFollower);
  };

  const setNumbFollowees = async (displayedUser: User) => {
    await presenter.setNumbFollowees(displayedUser, setFolloweeCount);
  };

  const setNumbFollowers = async (displayedUser: User) => {
    await presenter.setNumbFollowers(displayedUser, setFollowerCount);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    presenter.followDisplayedUser(
      displayedUser!,
      isFollower,
      setFollowerCount,
      setFolloweeCount,
      setIsFollower
    );
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    presenter.unfollowDisplayedUser(
      displayedUser!,
      isFollower,
      setFollowerCount,
      setFolloweeCount,
      setIsFollower
    );
  };

  const listener: InfoMessageView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
  };
  const [presenter] = useState(
    new UserInfoPresenter(listener, currentUser!, authToken!)
  );

  return (
    <div className={presenter.isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  <FollowButton
                    id={isFollower ? "unFollowButton" : "followButton"}
                    className={`btn btn-md ${
                      isFollower ? "btn-secondary" : "btn-primary"
                    } me-1`}
                    onClick={
                      isFollower ? unfollowDisplayedUser : followDisplayedUser
                    }
                    isLoading={presenter.isLoading}
                    buttonText={isFollower ? "Unfollow" : "Follow"}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
