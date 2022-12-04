import { Module } from "@nestjs/common";
import { AuthModule } from "../guard/auth.module";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

@Module({
  imports: [AuthModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
