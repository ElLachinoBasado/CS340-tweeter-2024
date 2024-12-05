import { StatusDTO } from "../../dto/StatusDTO";
import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDTO;
  readonly pageSize: number;
  readonly lastItem: StatusDTO | null;
}
