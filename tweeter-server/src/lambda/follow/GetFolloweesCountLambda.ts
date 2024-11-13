import { UserItemCountRequest, UserItemCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UserItemCountRequest
): Promise<UserItemCountResponse> => {
  const followService = new FollowService();
  const numFollowees = await followService.getFolloweeCount(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    count: numFollowees,
  };
};
