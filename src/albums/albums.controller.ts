import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { SongsService } from "../songs/songs.service";
import { SongSummary } from "../types";
import { AlbumsService } from "./albums.service";

interface AlbumsResponse {
  albums: Album[];
  songSummaries?: SongSummary[];
}

@Controller("albums")
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly songsService: SongsService
  ) {}

  @Get()
  async findAlbums(): Promise<AlbumsResponse> {
    const albums = await this.albumsService.findAll();

    return { albums: albums };
  }

  @Get(":albumId")
  async findOne(@Param("albumId") albumId: string): Promise<AlbumsResponse> {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    const songSummaries = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { albums: [album], songSummaries };
  }
}
