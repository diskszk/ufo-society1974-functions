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
  isDeleted: boolean;
}
