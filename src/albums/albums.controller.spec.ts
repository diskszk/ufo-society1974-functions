import { Test, TestingModule } from "@nestjs/testing";
import { mock } from "../mock/";
import { AlbumsController } from "./albums.controller";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";

class DummyAlbumsService {
  async findAll() {
    return [...mock.albums];
  }

  async findById(id: string) {
    return id === "sample001" ? mock.albums[0] : null;
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
    it("album配列を返すこと", async () => {
      const albums = await albumsController.findAll();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });
  });

  describe("/albums/:id", () => {
    it("アルバムが存在する場合、アルバムを返すこと", async () => {
      const album = await albumsController.findById("sample001");
      expect(album.title).toBe("test title 1");
    });

    it("アルバムが存在しない場合、エラーを返すこと", async () => {
      await expect(albumsController.findById("sample999")).rejects.toThrow();
    });
  });
});
