import { Test, TestingModule } from "@nestjs/testing";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";
import { mockData } from "../mock";
import { DraftAlbumsController } from "./draft-albums.controller";
import { SongsModule } from "../songs/songs.module";

export class DummyAlbumsService {
  async findDrafted() {
    return mockData.albums.filter(({ published }) => published === false);
  }

  async findById(id: string) {
    return mockData.albums.find((album) => album.id === id) || null;
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

describe("AlbumsController", () => {
  let draftAlbumsController: DraftAlbumsController;
  let albumsService: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlbumsModule, SongsModule],
    })
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    albumsService = module.get<AlbumsService>(AlbumsService);

    draftAlbumsController = new DraftAlbumsController(albumsService);
  });

  it("should be defined", () => {
    expect(draftAlbumsController).toBeDefined();
  });

  describe("findAllDraftedAlbums", () => {
    it("下書きのアルバムを全件取得する", async () => {
      const { albums } = await draftAlbumsController.findAllDraftedAlbums();
      expect(albums).toHaveLength(2);
    });
  });

  describe("setPublish", () => {
    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(
        draftAlbumsController.setPublish("test999", false)
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });

    it("IDと一致するアルバムが既に公開中かつ、queryにtrueが入力された場合、エラーを発生させること", async () => {
      await expect(
        draftAlbumsController.setPublish("sample01", true)
      ).rejects.toThrow(/IDと一致するアルバムは既に公開中です。/);
    });

    it("IDと一致するアルバムが既に非公開中かつ、queryにfalseが入力された場合、エラーを発生させること", async () => {
      await expect(
        draftAlbumsController.setPublish("sample02", false)
      ).rejects.toThrow(/IDと一致するアルバムは既に非公開です。/);
    });
  });

  describe("deleteAlbum", () => {
    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(
        draftAlbumsController.deleteAlbum("test999")
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });
  });
});
