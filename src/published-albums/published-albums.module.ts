import { Module } from "@nestjs/common";
import { PublishedAlbumsService } from "./published-albums.service";
import { PublishedAlbumsController } from "./published-albums.controller";
import { AlbumsModule } from "../albums/albums.module";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";

@Module({
  imports: [AlbumsModule, AuthModule, RoleModule],
  controllers: [PublishedAlbumsController],
  providers: [PublishedAlbumsService],
})
export class PublishedAlbumsModule {}
