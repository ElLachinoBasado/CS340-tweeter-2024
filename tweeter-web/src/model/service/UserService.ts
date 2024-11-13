import {
  AuthToken,
  FakeData,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  RegisterRequest,
  RegisterResponse,
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

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/authentication/register");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user === null || authToken === null) {
        throw new Error("Invalid registration");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response.message);
      throw new Error("Server failed to register");
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/authentication/getUser");

    if (response.success) {
      return User.fromDto(response.user);
    } else {
      console.error(response.message);
      throw new Error("Failed to get user");
    }
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
