import { Controller, Get, Param } from "@nestjs/common";
import { SongSummary } from "../types";
import { SongsService } from "./songs.service";

interface SongSummariesResponse {
  songSummaries: SongSummary[];
}

@Controller("albums/:albumId/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findSongSummariesByAlbumId(
    @Param("albumId") albumId: string
  ): Promise<SongSummariesResponse> {
    const songSummaries = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { songSummaries: songSummaries };
  }
}
