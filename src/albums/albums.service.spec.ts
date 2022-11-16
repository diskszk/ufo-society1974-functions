import { Test, TestingModule } from "@nestjs/testing";
import { mockAlbums } from "../mock/albums";
import { AlbumsService } from "./albums.service";

describe("AlbumsService", () => {
  let albumsService: AlbumsService;
  let fakeAlbumsService: Partial<AlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsService],
    }).compile();

    albumsService = module.get<AlbumsService>(AlbumsService);

    fakeAlbumsService = {
      findAll: async () => {
        return [...mockAlbums];
      },
    };
  });

  it("should be defined", () => {
    expect(albumsService).toBeDefined();
  });

  describe("findAll", () => {
    it("存在する場合、album配列を返す", async () => {
      const albums = await fakeAlbumsService.findAll();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });
  });
});
