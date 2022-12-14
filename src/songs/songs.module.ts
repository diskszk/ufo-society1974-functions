import { Module } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
