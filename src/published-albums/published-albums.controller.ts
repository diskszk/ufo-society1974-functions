import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { DraftAlbumsService } from "../draft-albums/draft-albums.service";
import { AuthGuard } from "../auth/auth.guard";
import { role } from "../constants";
import { Role } from "../decorators/role.decorator";
import { RoleGuard } from "../role/role.guard";
import { PublishedAlbumsService } from "./published-albums.service";

interface PublishedAlbumsResponse {
  publishedAlbums: Album[];
}

@Controller("published-albums")
export class PublishedAlbumsController {
  constructor(
    private readonly publishedAlbumsService: PublishedAlbumsService,
    private readonly draftAlbumService: DraftAlbumsService
  ) {}

  @Get()
  async findAlbums(): Promise<PublishedAlbumsResponse> {
    const albums = await this.publishedAlbumsService.findAll();

    return { publishedAlbums: albums };
  }

  @Get(":albumId")
  async findOne(
    @Param("albumId") albumId: string
  ): Promise<PublishedAlbumsResponse> {
    const album = await this.publishedAlbumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return { publishedAlbums: [album] };
  }

  @Post(":originAlbumId")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async publishAlbum(@Param("originAlbumId") originAlbumId: string) {
    // idをもとに元データを取得する
    const originAlbum = await this.draftAlbumService.findById(originAlbumId);

    if (!originAlbum) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    // 取得したデータで新しくidを生成する為削除する
    delete originAlbum.id;

    return this.publishedAlbumsService.create({ ...originAlbum });
  }
}
