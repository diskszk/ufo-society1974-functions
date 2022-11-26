import { Module } from "@nestjs/common";
// import { AuthModule } from "./guard/auth.module";
// import { UsersModule } from "./users/users.module";
import { AlbumsModule } from "./albums/albums.module";

@Module({
  imports: [AlbumsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
