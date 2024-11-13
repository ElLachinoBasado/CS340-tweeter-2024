import { UserDTO } from "../../dto/UserDTO";

export interface UserItemCountRequest {
  readonly token: string;
  readonly user: UserDTO;
}
