import { Module } from "@nestjs/common";
import { PublishedAlbumsService } from "./published-albums.service";
import { PublishedAlbumsController } from "./published-albums.controller";
import { AlbumsModule } from "../albums/albums.module";

@Module({
  imports: [AlbumsModule],
  controllers: [PublishedAlbumsController],
  providers: [PublishedAlbumsService],
})
export class PublishedAlbumsModule {}
