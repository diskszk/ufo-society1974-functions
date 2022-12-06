import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { PublishedAlbumsService } from "./published-albums.service";

describe("PublishedAlbumsService", () => {
  let publishedAlbumService: PublishedAlbumsService;
  let fakeService: Partial<PublishedAlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishedAlbumsService],
    }).compile();

    publishedAlbumService = module.get<PublishedAlbumsService>(
      PublishedAlbumsService
    );

    fakeService = {
      findAll: async () => {
        return [...mockData.albums];
      },
      findById: async (id: string) => {
        return mockData.albums.find((mockAlbum) => mockAlbum.id === id) || null;
      },
    };
  });

  it("should be defined", () => {
    expect(publishedAlbumService).toBeDefined();
  });

  describe("findAll", () => {
    it("アルバム一覧を取得する", async () => {
      const albums = await fakeService.findAll();
      expect(albums).toHaveLength(2);
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
