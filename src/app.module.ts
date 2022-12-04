import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";
import { AuthModule } from "./guard/auth.module";
import { AppController } from "./app.controller";

@Module({
  imports: [AlbumsModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
