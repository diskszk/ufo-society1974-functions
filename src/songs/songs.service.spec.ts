import { Test, TestingModule } from "@nestjs/testing";
import { mockData } from "../mock";
import { SongSummary } from "../types";
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
      findAllSongSummariesByAlbumId: async (albumId: string) => {
        const songSummaries: SongSummary[] = [...mockData.songs];
        return songSummaries;
      },
      findSongById: async (albumId: string, songId: string) => {
        if (albumId === "testid" && songId === "001") {
          return mockData.song;
        } else {
          return null;
        }
      },
    };
  });

  it("should be defined", () => {
    expect(songsService).toBeDefined();
  });

  describe("findAllSongSummariesByAlbumId", () => {
    it("IDと一致するアルバムが存在すると仮定し、該当するアルバムの曲一覧を返す", async () => {
      const songSummaries =
        await fakeSongsService.findAllSongSummariesByAlbumId("testid");

      expect(songSummaries).toHaveLength(2);
    });
  });

  describe("findSongById", () => {
    it("IDと一致するアルバムが存在すると仮定し、該当するアルバムからIDと一致する楽曲が存在する場合、該当する楽曲を返す", async () => {
      const song = await fakeSongsService.findSongById("testid", "001");

      expect(song.id).toBe("001");
    });
    it("IDと一致するアルバムが存在すると仮定し、該当するアルバムからIDと一致する楽曲が存在しない場合、nullを返す", async () => {
      const song = await fakeSongsService.findSongById("testid", "999");

      expect(song).toBeNull();
    });
  });
});
