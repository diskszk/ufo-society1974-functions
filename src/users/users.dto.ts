import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { User } from "ufo-society1974-definition-types";

export class CreateUserDTO implements User {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  role: "master" | "editor" | "watcher";

  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsBoolean()
  isSignedIn: boolean;

  @IsBoolean()
  isDeleted: boolean;
}
