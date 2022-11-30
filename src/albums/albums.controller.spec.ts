import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock/";
import { UserIdAndRole } from "../types";
import { UsersService } from "../users/users.service";
import { AlbumsController } from "./albums.controller";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";

class DummyAlbumsService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    return id === "sample001" ? mockData.albums[0] : null;
  }

  async create(
    albumDTO: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return null;
  }
}

class DummyUsersService {
  // 正常系のテストが難しく行わない
  // 異常系だけテストするため無条件でuserを返すようにしている
  async findById(id: string): Promise<UserIdAndRole> {
    return mockData.user.watcher;
  }
}

describe("AlbumsController", () => {
  let albumsController: AlbumsController;
  let albumsService: AlbumsService;
  // let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlbumsModule],
    })
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .overrideProvider(UsersService)
      .useClass(DummyUsersService)
      .compile();

    albumsService = module.get<AlbumsService>(AlbumsService);
    // usersService = module.get<UsersService>(UsersService);
    albumsController = new AlbumsController(albumsService);
    // albumsController = new AlbumsController(albumsService, usersService);
  });

  it("should be defined", () => {
    expect(albumsController).toBeDefined();
  });

  describe("/albums", () => {
    it("アルバム一覧を返す", async () => {
      const albums = await albumsController.findAll();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });

    it.skip("ユーザーのロールがeditorでない場合、エラーを発生させること", async () => {
      await expect(
        albumsController.createAlbum(mockData.album)
      ).rejects.toThrow(/Forbidden/);
    });
  });

  describe("/albums/:id", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const album = await albumsController.findById("sample001");
      expect(album.title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(albumsController.findById("sample999")).rejects.toThrow(
        /Missing Album Id/
      );
    });
  });
});
