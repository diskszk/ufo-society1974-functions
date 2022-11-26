import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";
import { AuthModule } from "./guard/auth.module";

@Module({
  imports: [AlbumsModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
