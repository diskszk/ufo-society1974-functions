import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { User } from "./user.entity";

export class CreateUserDTO extends OmitType(User, ["uid"]) {
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
  isDeleted: boolean;
}

export class UpdateUserDTO extends PartialType(User) {
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
  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean;
}
