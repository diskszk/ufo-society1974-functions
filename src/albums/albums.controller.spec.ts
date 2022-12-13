import { Test, TestingModule } from "@nestjs/testing";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";
import { mockData } from "../mock";
import { AlbumsController } from "./albums.controller";
import { SongSummary } from "../types";
import { SongsModule } from "../songs/songs.module";
import { SongsService } from "../songs/songs.service";

export class DummyAlbumsService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    const album = mockData.albums.find((album) => album.id === id) || null;
    return album;
  }

  async create(
    albumDTO: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return null;
  }

  async setPublish(albumId: string): Promise<FirebaseFirestore.WriteResult> {
    return null;
  }

  async setUnpublish(albumId: string): Promise<FirebaseFirestore.WriteResult> {
    return null;
  }

  async delete(albumId: string): Promise<FirebaseFirestore.WriteResult> {
    return null;
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

  describe("findPublishedAlbums", () => {
    it("公開済みのアルバムを全件取得する", async () => {
      const { albums } = await albumsController.findAlbums();
      expect(albums).toHaveLength(3);
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
  });

  describe("setPublish", () => {
    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(
        albumsController.setPublish("test999", false)
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });

    it("IDと一致するアルバムが既に公開中かつ、queryにtrueが入力された場合、エラーを発生させること", async () => {
      await expect(
        albumsController.setPublish("sample01", true)
      ).rejects.toThrow(/IDと一致するアルバムは既に公開中です。/);
    });

    it("IDと一致するアルバムが既に非公開中かつ、queryにfalseが入力された場合、エラーを発生させること", async () => {
      await expect(
        albumsController.setPublish("sample02", false)
      ).rejects.toThrow(/IDと一致するアルバムは既に非公開です。/);
    });
  });

  describe("delete", () => {
    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(albumsController.deleteAlbum("test999")).rejects.toThrow(
        /IDと一致するアルバムは存在しません。/
      );
    });
  });
});
