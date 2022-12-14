import { Test, TestingModule } from "@nestjs/testing";
import { SongsController } from "./songs.controller";
import { SongsModule } from "./songs.module";
import { SongsService } from "./songs.service";

class DummySongsService {}

describe("SongsController", () => {
  let songsController: SongsController;
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SongsModule],
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
