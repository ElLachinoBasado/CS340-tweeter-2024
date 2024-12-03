import {
  AuthToken,
  AuthTokenDTO,
  FakeData,
  User,
  UserDTO,
} from "tweeter-shared";
import { Buffer } from "buffer";
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
    const hashedPassword = await this.usersFactory.getPassword(alias);
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (isPasswordValid) {
      const user = FakeData.instance.firstUser!.dto;
      if (user === null) {
        throw new Error("Invalid alias or password");
      }
      return [user, FakeData.instance.authToken.dto];
    } else {
      throw new Error("Invalid alias or password");
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias)?.dto ?? null;
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
