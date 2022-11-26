import { Test, TestingModule } from "@nestjs/testing";
import { initializeApp } from "firebase-admin";
import { mock } from "../mock/";
import { AlbumsService } from "./albums.service";

jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
}));

describe("AlbumsService", () => {
  let albumsService: AlbumsService;
  let fakeAlbumsService: Partial<AlbumsService>;

  beforeEach(async () => {
    initializeApp();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsService],
    }).compile();

    albumsService = module.get<AlbumsService>(AlbumsService);

    fakeAlbumsService = {
      findAll: async () => {
        return [...mock.albums];
      },
      findById: async (id: string) => {
        return mock.albums.find((mockAlbum) => mockAlbum.id === id) || null;
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(albumsService).toBeDefined();
  });

  describe("findAll", () => {
    it("存在する場合、album配列を返す", async () => {
      const albums = await fakeAlbumsService.findAll();

      expect(albums).toHaveLength(2);
      expect(albums[0].title).toBe("test title 1");
    });
  });

  describe("findById", () => {
    it("存在する場合、取得したアルバムを返す", async () => {
      const album = await fakeAlbumsService.findById("sample01");
      expect(album.id).toBe("sample01");
      expect(album.title).toBe("test title 1");
    });

    it("存在しない場合、nullを返す", async () => {
      const album = await fakeAlbumsService.findById("sample009");
      expect(album).toBeNull();
    });
  });
});
