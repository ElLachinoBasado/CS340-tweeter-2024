import {
  AuthToken,
  AuthTokenDTO,
  FakeData,
  User,
  UserDTO,
} from "tweeter-shared";
import { UsersFactory } from "../factory/UsersFactory";
import { S3DAOFactory } from "../factory/S3DAOFactory";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { TokensFactory } from "../factory/TokensFactory";

export class UserService {
  usersFactory: UsersFactory;
  s3Factory: S3DAOFactory;
  tokensFactory: TokensFactory;
  constructor() {
    this.usersFactory = new UsersFactory();
    this.s3Factory = new S3DAOFactory();
    this.tokensFactory = new TokensFactory();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    try {
      const hashedPassword = await this.usersFactory.getPassword(alias);
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) {
        throw new Error("Invalid alias or password");
      }

      const newToken = await this.tokensFactory.createToken(alias);
      if (!newToken) {
        throw new Error("Token not created");
      }

      const user = await this.getUser(newToken.token, alias);
      if (!user) {
        throw new Error("Could not retrieve user");
      }

      return [user, newToken];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const fileName = `${alias}-${uuidv4()}.${imageFileExtension}`;
    const imageURL = await this.s3Factory.uploadImage(fileName, userImageBytes);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersFactory.register(
      alias,
      firstName,
      lastName,
      imageURL,
      hashedPassword
    );

    if (user === null || user == undefined) {
      throw new Error("Invalid registration");
    } else {
      const token = await this.tokensFactory.createToken(alias);

      if (token === null || token == undefined) {
        throw new Error("Token not created");
      }
      return [user, token];
    }
  }

  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    const isExpired = await this.tokensFactory.checkToken(token, alias);

    if (isExpired) {
      throw new Error("Token expired, login again");
    } else {
      const user = await this.usersFactory.getUser(alias);
      if (user === null) {
        throw new Error("User not found");
      }
      return user;
    }
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
