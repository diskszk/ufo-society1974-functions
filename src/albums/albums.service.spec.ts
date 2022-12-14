import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { AlbumsService } from "./albums.service";

describe("AlbumsService", () => {
  let AlbumService: AlbumsService;
  let fakeService: Partial<AlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsService],
    }).compile();

    AlbumService = module.get<AlbumsService>(AlbumsService);

    fakeService = {
      findDrafted: async () => {
        return [...mockData.albums];
      },
      findById: async (id: string) => {
        return mockData.albums.find((mockAlbum) => mockAlbum.id === id) || null;
      },
    };
  });

  it("should be defined", () => {
    expect(AlbumService).toBeDefined();
  });

  describe("findAll", () => {
    it("アルバム一覧を取得する", async () => {
      const albums = await fakeService.findDrafted();
      expect(albums).toHaveLength(3);
    });
  });

  describe("findById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const album = await fakeService.findById("sample01");
      expect(album.id).toBe("sample01");
      expect(album.title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、nullを返す", async () => {
      const album = await fakeService.findById("sample009");
      expect(album).toBeNull();
    });
  });
});
