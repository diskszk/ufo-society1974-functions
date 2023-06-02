import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { User } from "./user.entity";
import { role } from "../constants";
// import { AuthGuard } from "../auth/auth.guard";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";
import { UsersService } from "./users.service";
import { Role } from "../decorators/role.decorator";
import { RoleGuard } from "../role/role.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("/users")
@Controller("users")
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [User], description: "ユーザーを全件取得する" })
  async findAllUser(): Promise<User[]> {
    const users = await this.usersService.findAll();

    return [...users];
  }

  @Get(":userId")
  @ApiOkResponse({
    type: User,
    description: "ユーザーIDと一致するユーザーを1件取得する",
  })
  @ApiNotFoundResponse({
    description: "IDと一致するユーザーは存在しません。",
  })
  async findUserById(@Param("userId") userId: string): Promise<User> {
    const targetUser = await this.usersService.findById(userId);

    if (!targetUser) {
      throw new NotFoundException("IDと一致するユーザーは存在しません。");
    }

    return { ...targetUser };
  }

  @Post()
  // @Role(role.MASTER)
  // @UseGuards(RoleGuard)
  @ApiCreatedResponse({ description: "ユーザーを新規登録する。" })
  async createUser(@Body() user: CreateUserDTO) {
    return this.usersService.create(user);
  }

  @Put(":userId")
  // @Role(role.MASTER)
  // @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiNoContentResponse({
    description: "ユーザーの情報を変更する。",
  })
  @ApiNotFoundResponse({
    description: "IDと一致するユーザーは存在しません。",
  })
  async updateUser(@Body() user: UpdateUserDTO) {
    const targetUser = await this.usersService.findById(user.uid);

    if (!targetUser) {
      throw new NotFoundException("IDと一致するユーザーは存在しません。");
    }

    return this.usersService.update(user);
  }

  // 論理削除(update)だがクライアントからみたら削除なのでHTTP DELETEメソッドを使う
  @Delete(":userId")
  @Role(role.MASTER)
  @UseGuards(RoleGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: "IDと一致するユーザーは存在しません。",
  })
  @ApiBadRequestResponse({
    description: "IDと一致するユーザーは管理者のため削除できません。",
  })
  async deleteUser(@Param("userId") userId: string) {
    const targetUser = await this.usersService.findById(userId);

    if (!targetUser) {
      throw new NotFoundException("IDと一致するユーザーは存在しません。");
    }

    // roleがmasterのユーザーは消せない
    if (targetUser.role === role.MASTER) {
      throw new BadRequestException(
        "IDと一致するユーザーは管理者のため削除できません。"
      );
    }

    return await this.usersService.delete(userId);
  }
}
