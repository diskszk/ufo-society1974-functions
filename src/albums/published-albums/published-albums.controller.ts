import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { SongsService } from "../../songs/songs.service";
import { SongSummary } from "../../types";
import { PublishedAlbumsService } from "./published-albums.service";
import { UpdateAlbumDTO } from "../albums.dto";
import { AuthGuard } from "../../auth/auth.guard";
import { Role } from "../../decorators/role.decorator";
import { role } from "../../constants";
import { RoleGuard } from "../../role/role.guard";

interface AlbumsResponse {
  albums: Album[];
  info?: {
    albumId: string;
    songSummaries: SongSummary[];
  };
}

/* TODO: webpageからアクセスできるようCORSを設定する */

@Controller("albums")
export class PublishedAlbumsController {
  constructor(
    private readonly publishedAlbumsService: PublishedAlbumsService,
    private readonly songsService: SongsService
  ) {}

  private async checkIsExistAlbum(albumId: string): Promise<void> {
    const isExist = await this.publishedAlbumsService.isExist(albumId);

    if (!isExist) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }
    return;
  }

  @Get()
  async findAllPublishedAlbums(): Promise<AlbumsResponse> {
    const publishedAlbums = await this.publishedAlbumsService.findAll();

    return { albums: publishedAlbums };
  }

  @Get(":albumId")
  async findPublishedAlbumById(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    await this.checkIsExistAlbum(albumId);

    const album = await this.publishedAlbumsService.findById(albumId);

    return { albums: [album] };
  }

  // adminアプリからのみ使用する
  @Put(":albumId")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async updatePublishedAlbum(
    @Body() album: UpdateAlbumDTO,
    @Param("albumId") albumId: string
  ) {
    await this.checkIsExistAlbum(albumId);

    return await this.publishedAlbumsService.update(album);
  }

  @Get(":albumId/summaries")
  async findAlbumAndSummary(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    await this.checkIsExistAlbum(albumId);

    const album = await this.publishedAlbumsService.findById(albumId);

    const songSummaries = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { albums: [album], info: { albumId, songSummaries } };
  }

  // adminアプリからのみ使用する
  /*
    対象のデータをdraft-albumsに作成し、published-albumsから削除する
  */
  @Post(":albumId/unpublish")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async unpublishAlbum(@Param("albumId") albumId: string) {
    await this.checkIsExistAlbum(albumId);

    const targetPublishedAlbum = await this.publishedAlbumsService.findById(
      albumId
    );

    try {
      return this.publishedAlbumsService.unpublish(
        { ...targetPublishedAlbum },
        albumId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
