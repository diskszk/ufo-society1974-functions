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

  describe("findAllUser", () => {
    it("未削除のユーザーを全件取得する", async () => {
      const { users } = await usersController.findAllUser();

      expect(users).toHaveLength(3);
      expect(users.filter(({ isDeleted }) => isDeleted)).toHaveLength(0);
    });
  });

  describe("findUserById", () => {
    it("IDと一致するユーザーが存在する場合、該当するユーザーを取得する", async () => {
      const res = await usersController.findUserById("testuid:editor");
      expect(res.users).toHaveLength(1);

      const user = res.users[0];
      expect(user.uid).toBe("testuid:editor");
    });

    it("IDと一致するユーザーが存在しない場合、404エラーを発生させる", async () => {
      await expect(usersController.findUserById("999")).rejects.toThrow(
        /指定されたユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが削除済みの場合、該当するユーザーを取得せず404エラーを発生させる", async () => {
      await expect(
        usersController.findUserById("testuid:deleted")
      ).rejects.toThrow(/指定されたユーザーは存在しません。/);
    });
  });

  describe("deleteUser", () => {
    it("IDと一致するユーザーが存在しない場合、403エラーを発生させる", async () => {
      await expect(usersController.deleteUser("999")).rejects.toThrow(
        /指定されたユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが既に削除済(論理削除)の場合、削除を行わずに400エラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:deleted")
      ).rejects.toThrow();
    });

    it("IDと一致するユーザーが管理ユーザー(master)である場合、削除を行わずに400エラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:master")
      ).rejects.toThrow();
    });
  });
});
