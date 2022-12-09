import { Test, TestingModule } from "@nestjs/testing";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsModule } from "./albums.module";
import { AlbumsService } from "./albums.service";
import { mockData } from "../mock";
import { AlbumsController } from "./albums.controller";

export class DummyAlbumsService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    return id === "sample01" ? mockData.albums[0] : null;
  }

  async create(
    albumDTO: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return null;
  }
}

describe("AlbumsController", () => {
  let controller: AlbumsController;
  let albumsService: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlbumsModule],
    })
      .overrideProvider(AlbumsService)
      .useClass(DummyAlbumsService)
      .compile();

    albumsService = module.get<AlbumsService>(AlbumsService);

    controller = new AlbumsController(albumsService);
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
});
