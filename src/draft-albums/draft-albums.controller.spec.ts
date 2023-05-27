import { Test, TestingModule } from "@nestjs/testing";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums/albums.dto";
import { mockData } from "../mock";
import { DraftAlbumsController } from "./draft-albums.controller";
import { DraftAlbumsService } from "./draft-albums.service";
import { DraftAlbumsModule } from "./draft-albums.module";
import { AlbumsService } from "../albums/albums.service";
import { AlbumsModule } from "../albums/albums.module";

export class DummyDraftAlbumsService {
  async findAll() {
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

  async update(
    albumDTO: UpdateAlbumDTO
  ): Promise<FirebaseFirestore.WriteResult> {
    return null;
  }

  async delete(albumId: string): Promise<FirebaseFirestore.WriteResult> {
    return null;
  }

  async setPublish(
    albumId: string
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return null;
  }
}

describe("AlbumsController", () => {
  let draftAlbumsController: DraftAlbumsController;
  let draftAlbumsService: DraftAlbumsService;
  let publishedAlbumsService: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DraftAlbumsModule, AlbumsModule],
    })
      .overrideProvider(DraftAlbumsService)
      .useClass(DummyDraftAlbumsService)
      .compile();

    draftAlbumsService = module.get<DraftAlbumsService>(DraftAlbumsService);

    draftAlbumsController = new DraftAlbumsController(
      draftAlbumsService,
      publishedAlbumsService
    );
  });

  it("should be defined", () => {
    expect(draftAlbumsController).toBeDefined();
  });

  describe("findAllDraftAlbums", () => {
    it("下書きのアルバムを全件取得する", async () => {
      const { albums } = await draftAlbumsController.findAllDraftAlbums();
      expect(albums).toHaveLength(2);
    });
  });

  describe("findDraftAlbumById", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const response = await draftAlbumsController.findDraftAlbumById(
        "sample01"
      );
      const draftAlbum = response.albums[0];
      expect(draftAlbum.id).toBe("sample01");
      expect(draftAlbum.title).toBe("test title 1");
    });
  });

  // describe("updateDraftAlbum", () => {});

  describe("deleteDraftAlbum", () => {
    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(
        draftAlbumsController.deleteDraftAlbum("test999")
      ).rejects.toThrow(/IDと一致するアルバムは存在しません。/);
    });
  });

  // describe("setPublish", () => {});
});
