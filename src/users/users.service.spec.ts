import { Test, TestingModule } from "@nestjs/testing";
import { initializeApp } from "firebase-admin";
import { mock } from "../mock";
import { UsersService } from "./users.service";

jest.mock("firebase-admin", () => {
  return {
    initializeApp: jest.fn(),
  };
});

describe("UsersService", () => {
  let usersService: UsersService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    initializeApp();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    fakeUsersService = {
      findById: async (id: string) => {
        if (id === "testuid") {
          return { ...mock.users[0] };
        } else {
          return null;
        }
      },
    };
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("fundById", () => {
    it("存在する場合、ユーザーを返す", async () => {
      const user = await fakeUsersService.findById("testuid");
      expect(user.uid).toBe("testuid");
      expect(user.displayName).toBe("test name");
    });

    it("存在しない場合、nullを返す", async () => {
      const user = await fakeUsersService.findById("999");
      expect(user).toBeNull();
    });
  });
});
