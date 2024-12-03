import { UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface UsersDAOInterface extends DAOInterface {
  register(
    client: any,
    alias: string,
    firstName: string,
    lastName: string,
    userImage: string,
    hashedPassword: string
  ): Promise<void>;

  getPassword(client: any, alias: string): Promise<string>;
}
