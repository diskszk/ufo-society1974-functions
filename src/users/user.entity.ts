import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: "master" | "editor" | "watcher";

  @ApiProperty()
  username: string;

  @ApiProperty()
  isSignedIn: boolean;

  @ApiProperty()
  isDeleted: boolean;
}
