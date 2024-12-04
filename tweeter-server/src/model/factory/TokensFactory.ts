import { AuthTokenDTO } from "tweeter-shared";
import { TokensDAO } from "../dao/TokensDAO";
import { Factory } from "./Factory";
import { v4 as uuidv4 } from "uuid";

export class TokensFactory extends Factory<TokensDAO> {
  constructor() {
    super();
  }

  protected createDAO() {
    return new TokensDAO();
  }

  public async createToken(alias: string): Promise<AuthTokenDTO> {
    try {
      const token: string = uuidv4();
      const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
      const timestamp: number = Date.now() + 3600000 - timeZoneOffset;

      await this.DAO.createToken(this.client, token, timestamp, alias);

      const tokenDTO: AuthTokenDTO = {
        token: token,
        timestamp: timestamp,
      };

      return tokenDTO;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async checkToken(token: string, alias: string): Promise<boolean> {
    try {
      const isExpired = await this.DAO.checkToken(this.client, token, alias);
      return isExpired;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
