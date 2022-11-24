import { Controller, Get, UseGuards } from "@nestjs/common";
import { logger } from "firebase-functions/v1";
import { UserGuardDecorator } from "./decorators/UserGuardDecorator";
import { AuthGuard } from "./guard/auth.guard";

@Controller("app")
export class AppController {
  @Get("user")
  @UseGuards(AuthGuard)
  getHello(@UserGuardDecorator() user: any) {
    console.log(user);
    logger.log(user);
    return user;
  }

  @Get()
  helloWorld() {
    return "hello world";
  }
}
