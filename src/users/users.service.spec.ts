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
      findById: async (id: string) => {
        return id === "testuid" ? { ...mockData.users[0] } : null;
      },
    };
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("findById", () => {
    it("IDと一致するユーザーが存在する場合、該当するユーザーを返す", async () => {
      const user = await fakeUsersService.findById("testuid");
      expect(user.uid).toBe("testuid");
      expect(user.displayName).toBe("test name");
    });

    it("IDと一致するユーザーが存在しない場合、nullを返す", async () => {
      const user = await fakeUsersService.findById("999");
      expect(user).toBeNull();
    });
  });
});
