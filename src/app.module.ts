import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { RoleModule } from "./role/role.module";
import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";
import { SongsModule } from "./songs/songs.module";
import { AccessCountModule } from "./access-count/access-count.module";
import { DraftAlbumsModule } from "./draft-albums/draft-albums.module";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    UsersModule,
    AlbumsModule,
    SongsModule,
    AccessCountModule,
    DraftAlbumsModule,
  ],
})
export class AppModule {}
