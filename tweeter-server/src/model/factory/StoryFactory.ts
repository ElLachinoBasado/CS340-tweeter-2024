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
}
