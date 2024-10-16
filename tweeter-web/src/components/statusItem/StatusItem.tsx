import { Status } from "tweeter-shared";
import Post from "./Post";
import { UserItem } from "../userItem/UserItem";

interface Props {    
    status: Status;    
}

export const StatusItem = (props: Props) => {
    return (
        <UserItem user={props.status.user}>
            {props.status.formattedDate}
            <br />
            <Post status={props.status}/>
        </UserItem>
    );

}