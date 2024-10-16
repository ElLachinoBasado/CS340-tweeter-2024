import { User } from "tweeter-shared";
import {
  UserItemPresenter  
} from "../../presenters/UserItemPresenter";
import { PagedItemView } from "../../presenters/PagedItemPresenter";
import { UserItem } from "../userItem/UserItem";
import { ItemScroller } from "./ItemScroller";
import { FollowService } from "../../model/service/FollowService";

interface Props {
  presenterGenerator: (view: PagedItemView<User>) => UserItemPresenter;
}

export const UserItemScroller = (props: Props) => {
  return (
    <ItemScroller<User, FollowService, UserItemPresenter>
      presenterGenerator={props.presenterGenerator}
      renderItem={(item: User) => <UserItem user={item}/>}      
    />
  );
};
