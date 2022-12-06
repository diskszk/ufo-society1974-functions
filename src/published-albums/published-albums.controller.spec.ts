import { Test, TestingModule } from "@nestjs/testing";
import { DummyAlbumsService } from "../albums/albums.controller.spec";
import { CreateAlbumDTO } from "../albums/albums.dto";
import { AlbumsModule } from "../albums/albums.module";
import { AlbumsService } from "../albums/albums.service";
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
  let draftedAlbumsService: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublishedAlbumsModule, AlbumsModule],
    })
      .overrideProvider(PublishedAlbumsService)
      .useClass(DummyPublishedAlbumService)
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    publishedAlbumsService = module.get<PublishedAlbumsService>(
      PublishedAlbumsService
    );
    draftedAlbumsService = module.get<AlbumsService>(AlbumsService);

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
      const { albums } = await controller.findAlbums();
      expect(albums).toHaveLength(2);
    });
  });

  describe("findOne", () => {
    it("IDと一致するアルバムが存在する場合、該当するアルバムを返す", async () => {
      const response = await controller.findOne("sample01");

      const album = response.albums[0];
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
