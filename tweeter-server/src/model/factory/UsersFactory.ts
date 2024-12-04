import { UserDTO } from "tweeter-shared";
import { Factory } from "./Factory";
import { UsersDAO } from "../dao/UsersDAO";

export class UsersFactory extends Factory<UsersDAO> {
  constructor() {
    super();
  }

  protected createDAO() {
    return new UsersDAO();
  }

  public async register(
    alias: string,
    firstName: string,
    lastName: string,
    userImage: string,
    hashedPassword: string
  ): Promise<UserDTO> {
    try {
      await this.DAO.register(
        this.client,
        alias,
        firstName,
        lastName,
        userImage,
        hashedPassword
      );

      const userDTO: UserDTO = {
        alias: alias,
        firstName: firstName,
        lastName: lastName,
        imageUrl: userImage,
      };

      return userDTO;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getPassword(alias: string): Promise<string> {
    try {
      const password = await this.DAO.getPassword(this.client, alias);
      return password;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getUser(alias: string): Promise<UserDTO | null> {
    try {
      const user = await this.DAO.getUser(this.client, alias);
      if (!user) {
        return null;
      }
      const userDTO: UserDTO = {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      };
      return userDTO;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
