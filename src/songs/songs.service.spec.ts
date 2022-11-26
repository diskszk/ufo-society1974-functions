import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { SongsService } from "./songs.service";

describe("SongsService", () => {
  let songsService: SongsService;
  let fakeSongsService: Partial<SongsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongsService],
    }).compile();

    songsService = module.get<SongsService>(SongsService);

    fakeSongsService = {
      findAll: async (_albumId: string) => {
        return [...mockData.songs];
      },
    };
  });

  it("should be defined", () => {
    expect(songsService).toBeDefined();
  });

  describe("findAll", () => {
    it("存在する場合、配列を返す", async () => {
      const songs = await fakeSongsService.findAll("testid");
      expect(songs).toHaveLength(2);
    });
  });
});
