import { Controller, Get, Param } from "@nestjs/common";
import { SongSummary } from "../types";
import { SongsService } from "./songs.service";

interface SongsResponse {
  songSummaries: SongSummary[];
}

@Controller("albums/:albumId/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findSongsByAlbumId(
    @Param("albumId") albumId: string
  ): Promise<SongsResponse> {
    const songs = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { songSummaries: songs };
  }
}
