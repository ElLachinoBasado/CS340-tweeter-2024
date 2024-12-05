import { DAOInterface } from "./DAOInterface";

export interface StoryDAOInterface extends DAOInterface {
  postStatus(
    client: any,
    post: string,
    timestamp: number,
    alias: string
  ): Promise<void>;
}
