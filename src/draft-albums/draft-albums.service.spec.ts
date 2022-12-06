import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { DraftAlbumsService } from "./draft-albums.service";

describe("AlbumsService", () => {
  let albumsService: DraftAlbumsService;
  let fakeAlbumsService: Partial<DraftAlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftAlbumsService],
    }).compile();

    albumsService = module.get<DraftAlbumsService>(DraftAlbumsService);

    fakeAlbumsService = {
      findAll: async () => {
        return [...mockData.albums];
      },
      findById: async (id: string) => {
        return mockData.albums.find((mockAlbum) => mockAlbum.id === id) || null;
      },
    };
  });

  it("should be defined", () => {
    expect(albumsService).toBeDefined();
  });

  describe("findAll", () => {
    it("アルバム一覧を返す", async () => {
      const albums = await fakeAlbumsService.findAll();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });
  });

  describe("findById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const album = await fakeAlbumsService.findById("sample01");
      expect(album.id).toBe("sample01");
      expect(album.title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、nullを返す", async () => {
      const album = await fakeAlbumsService.findById("sample009");
      expect(album).toBeNull();
    });
  });
});
