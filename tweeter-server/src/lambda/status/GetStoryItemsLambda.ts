import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.user,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
