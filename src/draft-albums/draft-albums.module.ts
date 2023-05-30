import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { AlbumsModule } from "../albums/albums.module";
import { DraftAlbumsController } from "./draft-albums.controller";
import { DraftAlbumsService } from "./draft-albums.service";

@Module({
  imports: [AuthModule, RoleModule, AlbumsModule],
  controllers: [DraftAlbumsController],
  providers: [DraftAlbumsService],
  exports: [DraftAlbumsService],
})
export class DraftAlbumsModule {}
