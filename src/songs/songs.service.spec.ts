import { Test, TestingModule } from "@nestjs/testing";
import { SongsService } from "./songs.service";

describe("SongsService", () => {
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongsService],
    }).compile();

    songsService = module.get<SongsService>(SongsService);
  });

  it("should be defined", () => {
    expect(songsService).toBeDefined();
  });
});
