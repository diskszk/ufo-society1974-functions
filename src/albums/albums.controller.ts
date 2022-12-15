import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { SongsService } from "../songs/songs.service";
import { SongSummary } from "../types";
import { AlbumsService } from "./albums.service";

interface AlbumsResponse {
  albums: Album[];
  info?: {
    albumId: string;
    songSummaries: SongSummary[];
  };
}

/* TODO: webpageからアクセスできるようCORSを設定する */

// 基本webpageから使う想定なので、#GET /, #GET /:id があればok
@Controller("albums")
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly songsService: SongsService
  ) {}

  @Get()
  async findAllPublishedAlbums(): Promise<AlbumsResponse> {
    const publishedAlbums = await this.albumsService.findPublished();

    return { albums: publishedAlbums };
  }

  @Get(":albumId")
  async findAlbumAndSummary(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    // 公開されていなければ404
    if (!album.published) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    const songSummaries = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { albums: [album], info: { albumId, songSummaries } };
  }
}
