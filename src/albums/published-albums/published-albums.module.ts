import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { RoleModule } from "../../role/role.module";
import { PublishedAlbumsController } from "./published-albums.controller";
import { PublishedAlbumsService } from "./published-albums.service";
import { SongsModule } from "../../songs/songs.module";
import { DraftAlbumsModule } from "../draft-albums/draft-albums.module";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    SongsModule,
    forwardRef(() => DraftAlbumsModule),
  ],
  controllers: [PublishedAlbumsController],
  providers: [PublishedAlbumsService],
  exports: [PublishedAlbumsService],
})
export class PublishedAlbumsModule {}
