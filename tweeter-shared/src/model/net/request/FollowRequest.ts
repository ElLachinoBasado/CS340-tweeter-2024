import { UserDTO } from "../../dto/UserDTO";

export interface FollowRequest {
  readonly token: string;
  readonly user: UserDTO;
}
