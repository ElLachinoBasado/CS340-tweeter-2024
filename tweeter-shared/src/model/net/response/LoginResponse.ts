import { AuthTokenDTO } from "../../dto/AuthTokenDTO";
import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
  readonly user: UserDTO;
  readonly token: AuthTokenDTO;
}
