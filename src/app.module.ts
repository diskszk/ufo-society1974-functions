import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { RoleModule } from "./role/role.module";
import { UsersModule } from "./users/users.module";
import { DraftAlbumsModule } from "./draft-albums/draft-albums.module";
import { PublishedAlbumsModule } from "./published-albums/published-albums.module";

import { AppController } from "./app.controller";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    UsersModule,
    DraftAlbumsModule,
    PublishedAlbumsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
