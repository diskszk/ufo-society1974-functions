import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AlbumsService } from "../albums/albums.service";
import { PublishedAlbumsService } from "./published-albums.service";

interface Response {
  albums: Album[];
}

@Controller("published-albums")
export class PublishedAlbumsController {
  constructor(
    private readonly publishedAlbumsService: PublishedAlbumsService,
    private readonly draftAlbumService: AlbumsService
  ) {}

  @Get()
  async findAlbums(): Promise<Response> {
    const albums = await this.publishedAlbumsService.findAll();

    return { albums };
  }

  @Get(":albumId")
  async findOne(@Param("albumId") albumId: string): Promise<Response> {
    const album = await this.publishedAlbumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return { albums: [album] };
  }

  // editorのみ
  // albums/:idのリソースsongsを含めてコピーする
  @Post(":originAlbumId")
  async publishAlbum(@Param("originAlbumId") originAlbumId: string) {
    // idをもとに元データを取得する
    const originAlbum = await this.draftAlbumService.findById(originAlbumId);

    if (!originAlbum) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    // 取得したデータで新しくidも作成する
    delete originAlbum.id;

    return this.publishedAlbumsService.create({ ...originAlbum });
  }
}
