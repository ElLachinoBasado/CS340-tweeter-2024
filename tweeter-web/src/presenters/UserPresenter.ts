import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Buffer } from "buffer";

export interface UserView {
  navigate: NavigateFunction;
  displayErrorMessage(message: string): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
}

export abstract class UserPresenter {
  private _view: UserView;
  private _userService: UserService;
  private _isLoading: boolean;
  private _rememberMe: boolean;

  protected constructor(view: UserView) {
    this._view = view;
    this._userService = new UserService();
    this._isLoading = false;
    this._rememberMe = false;
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public get rememberMe() {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  public handleImageFile(
    file: File | undefined,
    setImageUrl: (url: string) => void,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageFileExtension: (fileExtension: string) => void
  ) {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public abstract userAccountAction(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): void;
}
