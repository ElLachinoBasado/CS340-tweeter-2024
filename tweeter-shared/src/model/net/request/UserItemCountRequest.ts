import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface UserItemCountRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDTO;
}
