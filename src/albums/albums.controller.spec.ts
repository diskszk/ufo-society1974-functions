import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock/";
import { AlbumsController } from "./albums.controller";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";

class DummyAlbumsService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    return id === "sample001" ? mockData.albums[0] : null;
  }
}

describe("AlbumsController", () => {
  let albumsController: AlbumsController;
  let albumsService: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlbumsModule],
    })
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    albumsService = module.get<AlbumsService>(AlbumsService);
    albumsController = new AlbumsController(albumsService);
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
  });

  describe("/albums/:id", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const album = await albumsController.findById("sample001");
      expect(album.title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、エラーが発生すること", async () => {
      await expect(albumsController.findById("sample999")).rejects.toThrow();
    });
  });
});
