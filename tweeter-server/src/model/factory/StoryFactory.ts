import { StatusDTO, UserDTO } from "tweeter-shared";
import { StoryDAO } from "../dao/StoryDAO";
import { Factory } from "./Factory";

export class StoryFactory extends Factory<StoryDAO> {
  constructor() {
    super();
  }

  protected createDAO() {
    return new StoryDAO();
  }

  public async postStatus(
    post: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    try {
      await this.DAO.postStatus(this.client, post, timestamp, alias);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getStories(
    user: UserDTO,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    try {
      const [items, hasMore] = await this.DAO.getStories(
        this.client,
        user,
        pageSize,
        lastItem
      );
      return [items, hasMore];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAllStories(user: UserDTO): Promise<StatusDTO[]> {
    try {
      const items = await this.DAO.getAllStories(this.client, user);
      return items;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
