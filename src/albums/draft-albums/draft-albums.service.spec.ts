import { Test, TestingModule } from "@nestjs/testing";
import { DraftAlbumsService } from "./draft-albums.service";
import { mockData } from "../../mock";
import { PublishedAlbumsService } from "../published-albums/published-albums.service";

describe("DraftAlbumsService", () => {
  let draftAlbumsService: DraftAlbumsService;
  let fakeDraftAlbumsService: Partial<DraftAlbumsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftAlbumsService, PublishedAlbumsService],
    }).compile();

    draftAlbumsService = module.get<DraftAlbumsService>(DraftAlbumsService);

    fakeDraftAlbumsService = {
      findAll: async () => {
        return [...mockData.albums];
      },
      findById: async (id: string) => {
        return mockData.albums.find((mockAlbum) => mockAlbum.id === id) || null;
      },
    };
  });

  it("should be defined", () => {
    expect(draftAlbumsService).toBeDefined();
  });

  describe("findAll", () => {
    it("未公開のアルバム一覧を取得する", async () => {
      const draftAlbums = await fakeDraftAlbumsService.findAll();
      expect(draftAlbums).toHaveLength(3);
    });
  });

  describe("findById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const draftAlbum = await fakeDraftAlbumsService.findById("sample01");
      expect(draftAlbum.id).toBe("sample01");
      expect(draftAlbum.title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、nullを返す", async () => {
      const draftALbum = await fakeDraftAlbumsService.findById("sample009");
      expect(draftALbum).toBeNull();
    });
  });
});
