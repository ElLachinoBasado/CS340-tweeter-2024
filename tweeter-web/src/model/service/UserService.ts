import {
  AuthToken,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return this.serverFacade.login(request);
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return this.serverFacade.register(request);
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    return this.serverFacade.getUser(request);
  }

  public async logout(request: LogoutRequest): Promise<void> {
    return this.serverFacade.logout(request);
  }
}
