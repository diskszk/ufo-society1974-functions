import { Test, TestingModule } from "@nestjs/testing";
import { mockAlbums } from "../mock/albums";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

describe("AlbumsController", () => {
  let albumsController: AlbumsController;

  const mockAlbumsService = {
    findAll: jest.fn().mockResolvedValue(mockAlbums),
    findById: jest.fn().mockResolvedValue(mockAlbums[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [AlbumsService],
    })
      .overrideProvider(AlbumsService)
      .useValue(mockAlbumsService)
      .compile();

    albumsController = module.get<AlbumsController>(AlbumsController);
  });

  it("should be defined", () => {
    expect(albumsController).toBeDefined();
  });

  describe("/albums", () => {
    it("album配列を返すこと", async () => {
      const albums = await albumsController.fetchAlbums();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });
  });

  describe("/albums/:id", () => {
    it("アルバムが存在する場合、アルバムを返すこと", async () => {
      const album = await albumsController.findAlbumById("sample001");
      expect(album.title).toBe("test title 1");
    });
  });
});
