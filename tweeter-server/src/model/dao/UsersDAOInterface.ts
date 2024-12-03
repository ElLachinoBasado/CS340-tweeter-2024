import { UserDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface UsersDAOInterface extends DAOInterface {
  register(client: any): Promise<UserDTO>;
}
