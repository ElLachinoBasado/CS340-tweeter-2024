import { FollowDTO } from "../dto/FollowDTO";
import { User } from "./User";

export class Follow {
  private _follower: User;
  private _followee: User;

  public constructor(follower: User, followee: User) {
    this._follower = follower;
    this._followee = followee;
  }

  public get follower(): User {
    return this._follower;
  }

  public set follower(value: User) {
    this._follower = value;
  }

  public get followee(): User {
    return this._followee;
  }

  public set followee(value: User) {
    this._followee = value;
  }

  public get dto(): FollowDTO {
    return {
      follower: this.follower.dto,
      followee: this.followee.dto,
    };
  }

  public static fromDto(dto: FollowDTO | null): Follow | null {
    return dto
      ? new Follow(User.fromDto(dto.follower)!, User.fromDto(dto.followee)!)
      : null;
  }
}
