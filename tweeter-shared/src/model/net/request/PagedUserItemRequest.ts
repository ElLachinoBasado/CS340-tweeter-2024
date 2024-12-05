import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDTO;
  readonly pageSize: number;
  readonly lastItem: UserDTO | null;
}
