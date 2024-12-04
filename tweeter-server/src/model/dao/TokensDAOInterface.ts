import { AuthTokenDTO } from "tweeter-shared";
import { DAOInterface } from "./DAOInterface";

export interface TokensDAOInterface extends DAOInterface {
  createToken(
    client: any,
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void>;

  checkToken(client: any, token: string, alias: string): Promise<boolean>;
  deleteToken(client: any, token: string, alias: string): Promise<void>;
}
