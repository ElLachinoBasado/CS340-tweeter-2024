import { StatusDTO, UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface StoryDAOInterface extends DAOInterface {
  postStatus(
    client: any,
    post: string,
    timestamp: number,
    alias: string
  ): Promise<void>;

  getStories(
    client: any,
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;

  getAllStories(client: any, user: UserDTO): Promise<StatusDTO[]>;
}
