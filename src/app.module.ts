import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { RoleModule } from "./role/role.module";
import { UsersModule } from "./users/users.module";
import { DraftAlbumsModule } from "./albums/draft-albums/draft-albums.module";
import { PublishedAlbumsModule } from "./albums/published-albums/published-albums.module";
import { SongsModule } from "./songs/songs.module";
import { AccessCountModule } from "./access-count/access-count.module";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    UsersModule,
    DraftAlbumsModule,
    PublishedAlbumsModule,
    SongsModule,
    AccessCountModule,
  ],
})
export class AppModule {}
