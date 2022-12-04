import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let usersService: UsersService;
  let fakeUsersService: Partial<UsersService>;

  // firebase-admin/authのUserRecord型
  // テスト環境だとfirebase-adminをimportするとエラーになるため代用する
  const fakeUserRecord = {
    email: "testuid:editor@mail.com",
    uid: "testuid:editor",
    emailVerified: false,
    disabled: false,
    metadata: null,
    providerData: [],
    toJSON: () => null,
  };

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
      findByEmail: async (email: string) => {
        return email === "testuid:editor@mail.com" ? fakeUserRecord : null;
      },
    };
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("findAll", () => {
    it("未削除であるユーザー一覧を返す", async () => {
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

  describe("findByEmail", () => {
    it("emailと一致するユーザーが存在する場合、該当するユーザーを返す", async () => {
      const findResult = await fakeUsersService.findByEmail(
        "testuid:editor@mail.com"
      );

      expect(findResult.email).toBe("testuid:editor@mail.com");
    });

    it("emailと一致するユーザーが存在しない場合、nullを返す", async () => {
      const findResult = await fakeUsersService.findByEmail("999");

      expect(findResult).toBeNull();
    });
  });
});
