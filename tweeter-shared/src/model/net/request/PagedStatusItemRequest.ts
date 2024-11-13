import { StatusDTO } from "../../dto/StatusDTO";

export interface PagedStatusItemRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDTO | null;
}
