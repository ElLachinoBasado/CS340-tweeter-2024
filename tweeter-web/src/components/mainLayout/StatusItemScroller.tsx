import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import { AuthToken, Status } from "tweeter-shared";
import { StatusItem } from "../statusItem/StatusItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/userInfoHook";


export const PAGE_SIZE = 10;

interface Props {
    errorMessage: string;
    loadMoreItemsHelper: (
        authToken: AuthToken, 
        userAlias: string, 
        pageSize: number, 
        lastItem: Status | null
    ) => Promise<[Status[], boolean]>
}

export const StatusItemScroller = (props: Props) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<Status[]>([]);
    const [newItems, setNewItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

    const addItems = (newItems: Status[]) =>
        setNewItems(newItems);

    const { displayedUser, authToken } = useUserInfoHook();

    useEffect(() => {
        reset();
    }, [displayedUser]);

    useEffect(() => {
        if(changedDisplayedUser) {
          loadMoreItems();
        }
    }, [changedDisplayedUser]);

    useEffect(() => {
        if(newItems) {
          setItems([...items, ...newItems]);
        }
    }, [newItems])

    const reset = async () => {
        setItems([]);
        setNewItems([]);
        setLastItem(null);
        setHasMoreItems(true);
        setChangedDisplayedUser(true);
    }

    const loadMoreItems = async () => {
        try {
            const [newItems, hasMore] = await props.loadMoreItemsHelper(
                authToken!,
                displayedUser!.alias,
                PAGE_SIZE,
                lastItem
            );

            setHasMoreItems(hasMore);
            setLastItem(newItems[newItems.length - 1]);
            addItems(newItems);
            setChangedDisplayedUser(false)
        } catch (error) {
            displayErrorMessage(
                `${props.errorMessage}: ${error}`
            );
        }
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={hasMoreItems}
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
    
}