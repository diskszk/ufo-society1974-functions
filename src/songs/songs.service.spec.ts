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
      findAll: async (albumId: string) => {
        return albumId === "testid" ? [...mockData.songs] : null;
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

    it("存在しない場合、nullを返す", async () => {
      const response = await fakeSongsService.findAll("999");
      expect(response).toBeNull();
    });
  });
});
