import { StatusDTO } from "../../dto/StatusDTO";

export interface PostStatusRequest {
  readonly token: string;
  readonly newStatus: StatusDTO;
}
