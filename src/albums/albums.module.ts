import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
