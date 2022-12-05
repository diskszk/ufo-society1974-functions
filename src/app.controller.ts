import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserInfo } from "firebase-admin/auth";
import { UserGuardDecorator } from "./decorators/UserGuardDecorator";
import { AuthGuard } from "./auth/auth.guard";
import { UsersService } from "./users/users.service";

@Controller("app")
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get("user")
  @UseGuards(AuthGuard)
  async getHello(@UserGuardDecorator() user: UserInfo) {
    const id = user.uid;
    await this.usersService.findById(id).then((res) => {
      console.log("res", res);
    });

    return user;
  }

  @Get()
  helloWorld() {
    return "hello world";
  }
}
