import { UserDTO } from "../../dto/UserDTO";

export interface IsFollowerRequest {
  readonly token: string;
  readonly user: UserDTO;
  readonly selectedUser: UserDTO;
}
