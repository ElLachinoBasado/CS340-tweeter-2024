import {
  AuthToken,
  AuthTokenDTO,
  FakeData,
  User,
  UserDTO,
} from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
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

    console.log(
      "You reached the register with",
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser?.dto;

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
