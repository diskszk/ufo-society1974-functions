import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let usersService: UsersService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    fakeUsersService = {
      findAll: async () => {
        return [...mockData.users].filter(({ isDeleted }) => !isDeleted);
      },
      findById: async (id: string) => {
        return id === "testuid:editor" ? mockData.user.editor : null;
      },
    };
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("findAll", () => {
    it("ユーザー一覧を返す", async () => {
      const users = await fakeUsersService.findAll();
      expect(users).toHaveLength(3);
    });
  });

  describe("findById", () => {
    it("IDと一致するユーザーが存在する場合、該当するユーザーを返す", async () => {
      const user = await fakeUsersService.findById("testuid:editor");
      expect(user.uid).toBe("testuid:editor");
    });

    it("IDと一致するユーザーが存在しない場合、nullを返す", async () => {
      const user = await fakeUsersService.findById("999");
      expect(user).toBeNull();
    });
  });
});
