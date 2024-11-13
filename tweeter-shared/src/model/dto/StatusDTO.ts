import { PostSegmentDTO } from "./PostSegmentDTO";
import { UserDTO } from "./UserDTO";

export interface StatusDTO {
  readonly post: string;
  readonly user: UserDTO;
  readonly timestamp: number;
  readonly segments: PostSegmentDTO[];
}
