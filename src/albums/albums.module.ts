import { Module } from "@nestjs/common";
import { AlbumsController } from "./albums.controller";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { AlbumsService } from "./albums.service";
import { SongsModule } from "../songs/songs.module";
import { DraftAlbumsModule } from "../draft-albums/draft-albums.module";

@Module({
  imports: [AuthModule, RoleModule, SongsModule, DraftAlbumsModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
