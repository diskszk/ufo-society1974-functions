import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

class DummySongsService {
  async findAll(id: string) {
    return id === "testid" ? [...mockData.songs] : null;
  }
}

describe("SongsController", () => {
  let songsController: SongsController;
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [SongsService],
    })
      .overrideProvider(SongsService)
      .useClass(DummySongsService)
      .compile();

    songsService = module.get<SongsService>(SongsService);
    songsController = new SongsController(songsService);
  });

  it("should be defined", () => {
    expect(songsController).toBeDefined();
  });

  describe("/albums/:albumId/songs", () => {
    it("アルバムIDと一致するアルバムが存在する場合、該当するアルバムの曲一覧を返す", async () => {
      const songs = await songsController.findSongsByAlbumId("testid");
      expect(songs).toHaveLength(2);
    });

    it("アルバムIDと一致するアルバムがない場合、エラーが発生すること", async () => {
      await expect(songsController.findSongsByAlbumId("999")).rejects.toThrow(
        /Missing Album Id/
      );
    });
  });
});
