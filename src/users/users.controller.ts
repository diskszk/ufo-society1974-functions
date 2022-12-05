import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { AuthGuard } from "../auth/auth.guard";
import { UserRoleInterceptor } from "../interceptor/userRole.interceptor";
import { CreateUserDTO } from "./users.dto";
import { UsersService } from "./users.service";

export interface UsersResponse {
  users: User[];
}

@Controller("users")
@UseGuards(AuthGuard)
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

    // 削除済みということなので404でよさそう
    if (targetUser.isDeleted) {
      throw new NotFoundException("指定されたユーザーは存在しません。");
    }

    return { users: [targetUser] };
  }

  @Post()
  @UseInterceptors(new UserRoleInterceptor(role.MASTER))
  async createUser(@Body() user: CreateUserDTO) {
    const findByEmailResult = await this.usersService.findByEmail(user.email);

    if (findByEmailResult) {
      throw new BadRequestException(
        "入力したメールアドレスは既に使われています。"
      );
    }

    return this.usersService.create(user);
  }

  // 論理削除だが利用者(フロントエンド)からしたら削除なのでHTTP DELETEメソッドでよさそう
  @Delete(":userId")
  @UseInterceptors(new UserRoleInterceptor(role.MASTER))
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
