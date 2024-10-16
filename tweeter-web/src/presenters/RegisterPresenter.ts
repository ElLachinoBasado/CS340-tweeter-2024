import { AuthToken, User } from "tweeter-shared";
import { UserAccessPresenter } from "./UserAccessPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends UserAccessPresenter {
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

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  protected getUserInformation(
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension
    );
  }

  protected navigateFunction(): void {
    this.view.navigate("/");
  }

  protected getActionDescription(): string {
    return "register user";
  }
}
