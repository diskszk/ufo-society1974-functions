import { Module } from "@nestjs/common";
import { AlbumsController } from "./albums.controller";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { AlbumsService } from "./albums.service";
import { SongsModule } from "../songs/songs.module";
import { DraftAlbumsController } from "./draft-albums.controller";

@Module({
  imports: [AuthModule, RoleModule, SongsModule],
  controllers: [AlbumsController, DraftAlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
