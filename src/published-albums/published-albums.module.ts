import { Module } from "@nestjs/common";
import { PublishedAlbumsService } from "./published-albums.service";
import { PublishedAlbumsController } from "./published-albums.controller";

@Module({
  controllers: [PublishedAlbumsController],
  providers: [PublishedAlbumsService],
})
export class PublishedAlbumsModule {}
