import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";
import { RoleModule } from "../role/role.module";

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
