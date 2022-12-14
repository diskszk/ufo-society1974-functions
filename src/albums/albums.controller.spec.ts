import { Test, TestingModule } from "@nestjs/testing";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";
import { mockData } from "../mock";
import { AlbumsController } from "./albums.controller";
import { SongSummary } from "../types";
import { SongsModule } from "../songs/songs.module";
import { SongsService } from "../songs/songs.service";

export class DummyAlbumsService {
  async findPublished() {
    return mockData.albums.filter(({ published }) => published);
  }

  async findById(id: string) {
    const album = mockData.albums.find((album) => album.id === id) || null;
    return album;
  }
}

export class DummySongsService {
  async findAllSongSummariesByAlbumId(albumId: string) {
    const songSummaries: SongSummary[] = [...mockData.songs];
    return songSummaries;
  }
}

describe("AlbumsController", () => {
  let albumsController: AlbumsController;
  let albumsService: AlbumsService;
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlbumsModule, SongsModule],
    })
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .overrideProvider(SongsService)
      .useClass(DummySongsService)
      .compile();

    albumsService = module.get<AlbumsService>(AlbumsService);
    songsService = module.get<SongsService>(SongsService);

    albumsController = new AlbumsController(albumsService, songsService);
  });

  it("should be defined", () => {
    expect(albumsController).toBeDefined();
  });

  describe("findAllPublishedAlbums", () => {
    it("公開済みのアルバムを全件取得する", async () => {
      const { albums } = await albumsController.findAllPublishedAlbums();
      expect(albums).toHaveLength(1);
    });
  });

  describe("findAlbumAndSummary", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムと楽曲の概要を返す", async () => {
      const response = await albumsController.findAlbumAndSummary("sample01");

      const album = response.albums[0];
      const info = response.info;
      expect(album.id).toBe("sample01");
      expect(info.songSummaries).toHaveLength(2);
    });

    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(
        albumsController.findAlbumAndSummary("test999")
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });

    it("IDと一致するアルバムが公開中でない場合、エラーを発生させること", async () => {
      await expect(
        albumsController.findAlbumAndSummary("sample02")
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });
  });
});
