import { UserDTO } from "tweeter-shared";
import { Factory } from "./Factory";
import { UsersDAO } from "../dao/UsersDAO";

export class UsersFactory extends Factory<UsersDAO> {
  constructor() {
    super();
  }

  public async register(): Promise<UserDTO> {
    const user = await this.DAO.register(this.client);

    return user;
  }

  protected createDAO() {
    return new UsersDAO();
  }
}
