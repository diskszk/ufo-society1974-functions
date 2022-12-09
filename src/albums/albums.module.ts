import { Module } from "@nestjs/common";
import { AlbumsController } from "./albums.controller";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { AlbumsService } from "./albums.service";

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
