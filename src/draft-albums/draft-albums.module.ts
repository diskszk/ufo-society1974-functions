import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { DraftAlbumsController } from "./draft-albums.controller";
import { DraftAlbumsService } from "./draft-albums.service";

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [DraftAlbumsController],
  providers: [DraftAlbumsService],
  exports: [DraftAlbumsService],
})
export class DraftAlbumsModule {}
