import { Test, TestingModule } from "@nestjs/testing";
import { DRAFT_ALBUMS, PUBLISHED_ALBUMS } from "../constants";
import { mockData } from "../mock";
import { SongTitleAndStory } from "../types";
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
      findAllSongTitleAndStories: async (
        targetRef: typeof DRAFT_ALBUMS | typeof PUBLISHED_ALBUMS,
        albumId: string
      ) => {
        const data: SongTitleAndStory[] = [...mockData.songs];
        return albumId === "testid" ? [...data] : null;
      },
    };
  });

  it("should be defined", () => {
    expect(songsService).toBeDefined();
  });

  describe("findAll", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムの曲一覧を返す", async () => {
      const songs = await fakeSongsService.findAllSongTitleAndStories(
        PUBLISHED_ALBUMS,
        "testid"
      );

      expect(songs).toHaveLength(2);
    });

    it("IDと一致するアルバムが存在しない場合、nullを返す", async () => {
      const response = await fakeSongsService.findAllSongTitleAndStories(
        PUBLISHED_ALBUMS,
        "999"
      );
      expect(response).toBeNull();
    });
  });
});
