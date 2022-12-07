import { Test, TestingModule } from "@nestjs/testing";
import { DraftAlbumsController } from "./draft-albums.controller";
import { DraftAlbumsModule } from "./draft-albums.module";
import { DraftAlbumsService } from "./draft-albums.service";
import { DummyAlbumsService } from "../albums-util/dummy-albums.service";

describe("DraftAlbumsController", () => {
  let albumsController: DraftAlbumsController;
  let albumsService: DraftAlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DraftAlbumsModule],
    })
      .overrideProvider(DraftAlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    albumsService = module.get<DraftAlbumsService>(DraftAlbumsService);
    albumsController = new DraftAlbumsController(albumsService);
  });

  it("should be defined", () => {
    expect(albumsController).toBeDefined();
  });

  describe("findAll", () => {
    it("アルバム一覧を返す", async () => {
      const { draftAlbums } = await albumsController.findAll();

      expect(draftAlbums).toHaveLength(2);
      expect(draftAlbums[0].title).toBe("test title 1");
    });
  });

  describe("findById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const { draftAlbums } = await albumsController.findById("sample001");
      expect(draftAlbums[0].title).toBe("test title 1");
    });

    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(albumsController.findById("sample999")).rejects.toThrow(
        /IDと一致するアルバムは存在しません。/
      );
    });
  });
});
