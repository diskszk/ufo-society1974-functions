import { Test, TestingModule } from "@nestjs/testing";
import { mock } from "../mock";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

class DummySongsService {
  async findAll() {
    return [...mock.songs];
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
    it("アルバムが存在する場合、曲一覧を返す", async () => {
      const songs = await songsController.findSongsByAlbumId("testid");
      expect(songs).toHaveLength(2);
    });
  });
});

