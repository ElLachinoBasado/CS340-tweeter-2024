import "isomorphic-fetch";
import { PagedStatusItemRequest, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;

  beforeEach(() => {
    statusService = new StatusService();
  });

  it("should retrieve a user's story pages until there are no more items", async () => {
    const authToken = new AuthToken("valid-auth-token", 1);
    const userAlias = "@allen";
    const pageSize = 10;
    let lastItem: Status | null = null;
    let hasMore = true;
    let allStatuses: Status[] = [];

    while (hasMore) {
      const request: PagedStatusItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      };

      const [statuses, hasMoreItems] = await statusService.loadMoreStoryItems(
        request
      );

      allStatuses = allStatuses.concat(statuses);
      hasMore = hasMoreItems;

      if (statuses.length > 0) {
        lastItem = statuses[statuses.length - 1];
      } else {
        lastItem = null;
      }
    }

    // Add assertions here to verify the results
    expect(Array.isArray(allStatuses)).toBe(true);
    expect(allStatuses.length).toBeGreaterThan(0);
    allStatuses.forEach((status) => {
      expect(status).toBeInstanceOf(Status);
    });
  });
});
