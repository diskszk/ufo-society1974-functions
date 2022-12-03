import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { User } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { UsersService } from "./users.service";

export interface UserResponse {
  users: User[];
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUser(): Promise<UserResponse> {
    const users = await this.usersService.findAll();

    return { users };
  }

  @Post(":userId")
  async deleteUser(@Param("userId") userId: string) {
    const targetUser = await this.usersService.findById(userId);

    if (!targetUser) {
      throw new NotFoundException("指定されたユーザーは存在しません。");
    }

    // roleがmasterのユーザーは消せない
    if (targetUser.role === role.MASTER) {
      throw new BadRequestException();
    }

    // すでに削除済みの場合400エラー
    if (targetUser.isDeleted) {
      throw new BadRequestException();
    }

    return await this.usersService.delete(userId);
  }
}
