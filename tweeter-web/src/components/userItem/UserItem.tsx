import { User } from "tweeter-shared";
import { Link } from "react-router-dom";
import { useUserNavigation } from "../userInfo/UserNavigationHook";

interface Props {
  user: User;
  children?: React.ReactNode;
}

export const UserItem = (props: Props) => {
  const { navigateToUser } = useUserNavigation();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.user.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.user.alias}
              </Link>
            </h2>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};


