import { Test, TestingModule } from "@nestjs/testing";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";
import { UsersModule } from "./users.module";
import { UsersService } from "./users.service";
import { mockData } from "../mock";

class DummyUsersService {
  async findAll(): Promise<User[]> {
    return [...mockData.users].filter(({ isDeleted }) => !isDeleted);
  }

  async findById(userId: string): Promise<User | null> {
    switch (userId) {
      case "testuid:editor": {
        return mockData.user.editor;
      }
      case "testuid:master": {
        return mockData.user.master;
      }
      case "testuid:watcher": {
        return mockData.user.watcher;
      }
      case "testuid:deleted": {
        return null;
      }
      default: {
        return null;
      }
    }
  }

  async create(_userDTO: CreateUserDTO) {
    return null;
  }

  async update(_usrDTO: UpdateUserDTO) {
    return null;
  }

  async delete(_id: string) {
    return null;
  }
}

describe("/users", () => {
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

  describe("/ (GET) => User[]", () => {
    it("未削除のユーザーを全件取得する", async () => {
      const users = (await usersController.findAllUser()) as User[];

      expect(users).toHaveLength(3);
      expect(users.filter(({ isDeleted }) => isDeleted)).toHaveLength(0);
    });
  });

  describe("/:id (GET) => User", () => {
    it("IDと一致するユーザーが存在する場合、該当するユーザーを取得する", async () => {
      const user = await usersController.findUserById("testuid:editor");

      expect(user.uid).toBe("testuid:editor");
    });

    it("IDと一致するユーザーが存在しない場合、エラーを発生させる", async () => {
      await expect(usersController.findUserById("999")).rejects.toThrow(
        /IDと一致するユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが削除済みの場合、エラーを発生させる", async () => {
      await expect(
        usersController.findUserById("testuid:deleted")
      ).rejects.toThrow(/IDと一致するユーザーは存在しません。/);
    });
  });

  describe("/:id (UPDATE)", () => {
    it("IDと一致するユーザーが存在しない場合、エラーを発生させる", async () => {
      const mockUser = mockData.user.editor;
      mockUser.uid = "999";
      await expect(usersController.updateUser(mockUser)).rejects.toThrow(
        /IDと一致するユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが既に削除済みの場合、エラーを発生させる", async () => {
      const mockUser = mockData.user.deletedUser;
      await expect(usersController.updateUser(mockUser)).rejects.toThrow(
        /IDと一致するユーザーは存在しません。/
      );
    });
  });

  describe("/:id (DELETE)", () => {
    it("IDと一致するユーザーが存在しない場合、エラーを発生させる", async () => {
      await expect(usersController.deleteUser("999")).rejects.toThrow(
        /IDと一致するユーザーは存在しません。/
      );
    });

    it("IDと一致するユーザーが既に削除済の場合、エラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:deleted")
      ).rejects.toThrow(/IDと一致するユーザーは存在しません。/);
    });

    it("IDと一致するユーザーが管理ユーザー(master)である場合、エラーを発生させる", async () => {
      await expect(
        usersController.deleteUser("testuid:master")
      ).rejects.toThrow(/IDと一致するユーザーは管理者のため削除できません。/);
    });
  });
});
