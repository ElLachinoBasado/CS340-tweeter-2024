import { AuthTokenDTO } from "../../dto/AuthTokenDTO";
import { UserDTO } from "../../dto/UserDTO";

export interface LoginResponse {
  readonly user: UserDTO;
  readonly token: AuthTokenDTO;
}
