import { Status } from "tweeter-shared";
import { StatusItem } from "../statusItem/StatusItem";
import { StatusPresenter } from "../../presenters/StatusPresenter";
import { PagedItemView } from "../../presenters/PagedItemPresenter";
import { ItemScroller } from "./ItemScroller";
import { StatusService } from "../../model/service/StatusService";

interface Props {
  presenterGenerator: (view: PagedItemView<Status>) => StatusPresenter;
}

export const StatusItemScroller = (props: Props) => {
  return (
    <ItemScroller<Status, StatusService, StatusPresenter>
        presenterGenerator={props.presenterGenerator}
        renderItem={(item: Status) => <StatusItem status={item} />}
      />
  );
};
