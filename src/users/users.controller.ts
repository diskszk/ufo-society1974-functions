import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { User } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { UsersService } from "./users.service";

export interface UsersResponse {
  users: User[];
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUser(): Promise<UsersResponse> {
    const users = await this.usersService.findAll();

    return { users: [...users] };
  }

  @Get(":userId")
  async findUserById(@Param("userId") userId: string): Promise<UsersResponse> {
    const targetUser = await this.usersService.findById(userId);

    if (!targetUser) {
      throw new NotFoundException("指定されたユーザーは存在しません。");
    }

    // 削除済みということなので404で良いだろう
    if (targetUser.isDeleted) {
      throw new NotFoundException("指定されたユーザーは存在しません。");
    }

    return { users: [targetUser] };
  }

  // 論理削除だが利用者(フロントエンド)からしたら削除なのでHTTP DELETEメソッドで良いだろう
  @Delete(":userId")
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
