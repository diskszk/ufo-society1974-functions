import { Test, TestingModule } from "@nestjs/testing";
import { DummyAlbumsService } from "../albums-util/dummy-albums.service";
import { CreateAlbumDTO } from "../albums-util/albums.dto";
import { DraftAlbumsModule } from "../draft-albums/draft-albums.module";
import { DraftAlbumsService } from "../draft-albums/draft-albums.service";
import { mockData } from "../mock";
import { PublishedAlbumsController } from "./published-albums.controller";
import { PublishedAlbumsModule } from "./published-albums.module";
import { PublishedAlbumsService } from "./published-albums.service";

class DummyPublishedAlbumService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    return id === "sample01" ? mockData.album : null;
  }

  async create(
    albumDTO: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    albumDTO;
    return null;
  }
}

describe("PublishedAlbumsController", () => {
  let controller: PublishedAlbumsController;
  let publishedAlbumsService: PublishedAlbumsService;
  let draftedAlbumsService: DraftAlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublishedAlbumsModule, DraftAlbumsModule],
    })
      .overrideProvider(PublishedAlbumsService)
      .useClass(DummyPublishedAlbumService)
      .overrideProvider(DraftAlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    publishedAlbumsService = module.get<PublishedAlbumsService>(
      PublishedAlbumsService
    );
    draftedAlbumsService = module.get<DraftAlbumsService>(DraftAlbumsService);

    controller = new PublishedAlbumsController(
      publishedAlbumsService,
      draftedAlbumsService
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAlbums", () => {
    it("公開済みアルバムを全件取得する", async () => {
      const { publishedAlbums } = await controller.findAlbums();
      expect(publishedAlbums).toHaveLength(2);
    });
  });

  describe("findOne", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const response = await controller.findOne("sample01");

      const album = response.publishedAlbums[0];
      expect(album.id).toBe("sample01");
    });

    it("IDと一致するアルバムが存在しない場合、エラーを発生させること", async () => {
      await expect(controller.findOne("test999")).rejects.toThrow(
        /IDと一致するアルバムは存在しません。/
      );
    });
  });

  describe("publishAlbum", () => {
    it("元となるアルバムのIDと一致するアルバムが存在しない場合、404エラーを発生させること", async () => {
      await expect(controller.publishAlbum("test999")).rejects.toThrow(
        /IDと一致するアルバムは存在しません。/
      );
    });
  });
});
