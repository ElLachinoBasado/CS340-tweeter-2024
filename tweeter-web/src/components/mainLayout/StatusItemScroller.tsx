import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import { StatusItem } from "../statusItem/StatusItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import { StatusPresenter, StatusView } from "../../presenters/StatusPresenter";

interface Props {
  presenterGenerator: (view: StatusView) => StatusPresenter;
}

export const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const [newItems, setNewItems] = useState<Status[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfoHook();

  useEffect(() => {
    reset();
  }, [displayedUser]);

  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  const listener: StatusView = {
    addItems: (newItems: Status[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem status={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
