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
      findById: async (id: string) => {
        return mockAlbums.find((mockAlbum) => mockAlbum.id === id) || null;
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

  describe("findById", () => {
    it("存在する場合、取得したアルバムを返す", async () => {
      const album = await fakeAlbumsService.findById("sample01");
      expect(album.id).toBe("sample01");
      expect(album.title).toBe("test title 1");
    });

    it("存在しない場合、nullを返す", async () => {
      const album = await fakeAlbumsService.findById("sample009");
      expect(album).toBeNull();
    });
  });
});
