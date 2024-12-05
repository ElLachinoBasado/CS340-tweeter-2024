import { useEffect, useState } from "react";
import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenters/PagedItemPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import InfiniteScroll from "react-infinite-scroll-component";

// I is the type of the items to be displayed
// S is the type of the service to be used
// P is the type of the presenter to be used
interface Props<I, S, P extends PagedItemPresenter<I, S>> {
  presenterGenerator: (view: PagedItemView<I>) => P;
  renderItem: (item: I) => React.ReactNode;
}

export const ItemScroller = <I, S, P extends PagedItemPresenter<I, S>>(
  props: Props<I, S, P>
) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<I[]>([]);
  const [newItems, setNewItems] = useState<I[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfoHook();

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
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
    presenter.loadMoreItems(authToken!, displayedUser?.dto!);
    setChangedDisplayedUser(false);
  };

  const listener: PagedItemView<I> = {
    addItems: (newItems: I[]) => setNewItems(newItems),
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
            {props.renderItem(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
