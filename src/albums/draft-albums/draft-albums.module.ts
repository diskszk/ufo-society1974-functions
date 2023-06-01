import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { RoleModule } from "../../role/role.module";
import { DraftAlbumsController } from "./draft-albums.controller";
import { DraftAlbumsService } from "./draft-albums.service";
import { PublishedAlbumsModule } from "../published-albums/published-albums.module";

@Module({
  imports: [
    AuthModule,
    RoleModule,
    PublishedAlbumsModule,
    forwardRef(() => PublishedAlbumsModule),
  ],
  controllers: [DraftAlbumsController],
  providers: [DraftAlbumsService],
  exports: [DraftAlbumsService],
})
export class DraftAlbumsModule {}
