import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [AlbumsModule, AuthModule, UsersModule, RoleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
