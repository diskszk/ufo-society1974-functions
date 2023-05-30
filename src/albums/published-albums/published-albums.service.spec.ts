import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../../mock";
import { PublishedAlbumsService } from "./published-albums.service";
import { DraftAlbumsService } from "../draft-albums/draft-albums.service";

describe("PublishedAlbumsService", () => {
  let publishedAlbumsService: PublishedAlbumsService;
  let fakeService: Partial<PublishedAlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishedAlbumsService, DraftAlbumsService],
    }).compile();

    publishedAlbumsService = module.get<PublishedAlbumsService>(
      PublishedAlbumsService
    );

    fakeService = {
      findAll: async () => {
        return [...mockData.publishedAlbums];
      },
      findById: async (id: string) => {
        return (
          mockData.publishedAlbums.find((mockAlbum) => mockAlbum.id === id) ||
          null
        );
      },
    };
  });

  it("should be defined", () => {
    expect(publishedAlbumsService).toBeDefined();
  });

  describe("findAll", () => {
    it("アルバム一覧を取得する", async () => {
      const albums = await fakeService.findAll();
      expect(albums).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const album = await fakeService.findById("published01");
      expect(album.id).toBe("published01");
      expect(album.title).toBe("test title published 1");
    });

    it("IDと一致するアルバムが存在しない場合、nullを返す", async () => {
      const album = await fakeService.findById("sample009");
      expect(album).toBeNull();
    });
  });
});
