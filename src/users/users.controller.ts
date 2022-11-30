import { Controller, Get } from "@nestjs/common";
import { User } from "ufo-society1974-definition-types";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
