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

export class UserService {
  usersFactory: UsersFactory;
  s3Factory: S3DAOFactory;
  constructor() {
    this.usersFactory = new UsersFactory();
    this.s3Factory = new S3DAOFactory();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser!.dto;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    // const imageStringBase64: string =
    //   Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser?.dto;

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
    }

    return [user, FakeData.instance.authToken.dto];
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
