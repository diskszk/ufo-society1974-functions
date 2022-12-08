import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { SongTitleAndStory } from "../types";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

class DummySongsService {
  async findAllSongTitleAndStories(albumId: string) {
    const data: SongTitleAndStory[] = [...mockData.songs];
    return albumId === "testid" ? [...data] : null;
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
});
