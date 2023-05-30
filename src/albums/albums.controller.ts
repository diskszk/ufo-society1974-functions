import {
  BadRequestException,
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
import { SongsService } from "../songs/songs.service";
import { SongSummary } from "../types";
import { AlbumsService } from "./albums.service";
import { UpdateAlbumDTO } from "./albums.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../decorators/role.decorator";
import { role } from "../constants";
import { RoleGuard } from "../role/role.guard";
import { DraftAlbumsService } from "../draft-albums/draft-albums.service";

interface AlbumsResponse {
  albums: Album[];
  info?: {
    albumId: string;
    songSummaries: SongSummary[];
  };
}

/* TODO: webpageからアクセスできるようCORSを設定する */

@Controller("albums")
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly songsService: SongsService,
    private readonly draftAlbumsService: DraftAlbumsService // 順番変える
  ) {}

  private async checkIsExistAlbum(albumId: string): Promise<void> {
    const isExist = await this.albumsService.isExist(albumId);

    if (!isExist) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }
    return;
  }

  @Get()
  async findAllPublishedAlbums(): Promise<AlbumsResponse> {
    const publishedAlbums = await this.albumsService.findAll();

    return { albums: publishedAlbums };
  }

  @Get(":albumId")
  async findPublishedAlbumById(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    await this.checkIsExistAlbum(albumId);

    const album = await this.albumsService.findById(albumId);

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

    return await this.albumsService.update(album);
  }

  @Get(":albumId/summaries")
  async findAlbumAndSummary(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    await this.checkIsExistAlbum(albumId);

    const album = await this.albumsService.findById(albumId);

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

    const isExistInDraftAlbums = await this.draftAlbumsService.isExist(albumId);

    if (isExistInDraftAlbums) {
      throw new BadRequestException("IDと一致するアルバムは既に非公開中です。");
    }

    const targetPublishedAlbum = await this.albumsService.findById(albumId);

    try {
      this.albumsService.unpublish({ ...targetPublishedAlbum }, albumId);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
