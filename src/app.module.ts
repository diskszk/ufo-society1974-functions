import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { RoleModule } from "./role/role.module";
import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";

import { AppController } from "./app.controller";

@Module({
  imports: [AuthModule, RoleModule, UsersModule, AlbumsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
