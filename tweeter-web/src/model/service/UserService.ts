import {
  AuthToken,
  FakeData,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ClientCommunicator } from "../ClientCommunicator";

export class UserService {
  private SERVER_URL =
    "https://dsmhw19g68.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/authentication/login");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.token);
      if (user === null || authToken === null) {
        throw new Error("User or authToken returned null");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response.message);
      throw new Error("Invalid alias or password");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/authentication/logout");

    if (response.success) {
      await new Promise((res) => setTimeout(res, 1000));
    } else {
      console.error(response.message);
      throw new Error("Logout failed");
    }
  }
}
