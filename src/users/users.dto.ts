import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  role: "master" | "editor" | "watcher";

  @ApiProperty()
  @IsBoolean()
  isSignedIn: boolean;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  role: "master" | "editor" | "watcher";

  @ApiProperty()
  @IsBoolean()
  isSignedIn: boolean;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;
}
