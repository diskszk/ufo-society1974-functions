import { Test, TestingModule } from "@nestjs/testing";
import { User } from "ufo-society1974-definition-types";
import { mockData } from "../mock";
import { UsersController } from "./users.controller";
import { CreateUserDTO } from "./users.dto";
import { UsersModule } from "./users.module";
import { UsersService } from "./users.service";

class DummyUsersService {
  async findAll(): Promise<User[]> {
    return [...mockData.users].filter(({ isDeleted }) => !isDeleted);
  }

  async findById(userId: string): Promise<User | null> {
    switch (userId) {
      case "testuid:editor": {
        return mockData.user.editor;
      }
      case "tsetuid:master": {
        return mockData.user.master;
      }
      case "testuid:watcher": {
        return mockData.user.watcher;
      }
      case "testuid:deleted": {
        return mockData.user.deletedUser;
      }
      default: {
        return null;
      }
    }
  }

  async create(userDTO: CreateUserDTO) {
    return null;
  }

  async delete(id: string) {
    return null;
  }
}

describe("UsersController", () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useClass(DummyUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  it("findAllUser", async () => {
    const users = await usersController.findAllUser();

    expect(users.users).toHaveLength(3);
  });

  describe("deleteUser", () => {
    it("IDと一致するユーザーが存在しない場合、エラーを発生させる", async () => {
      await expect(usersController.deleteUser("999")).rejects.toThrow(
        /指定されたユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが既に削除済(論理削除)の場合、削除を行わずにエラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:deleted")
      ).rejects.toThrow();
    });

    it("IDと一致するユーザーが管理ユーザー(master)である場合、削除を行わずにエラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:master")
      ).rejects.toThrow();
    });
  });
});
