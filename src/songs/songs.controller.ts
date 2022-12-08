import { Controller, Get, Param } from "@nestjs/common";
import { PUBLISHED_ALBUMS } from "../constants";
import { SongTitleAndStory } from "../types";
import { SongsService } from "./songs.service";

interface SongsResponse {
  songTitlesAndStories: SongTitleAndStory[];
}

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("albums/:albumId/songs")
  async findSongsByAlbumId(
    @Param("albumId") albumId: string
  ): Promise<SongsResponse> {
    const songs = await this.songsService.findAllSongTitleAndStories(
      PUBLISHED_ALBUMS,
      albumId
    );

    return { songTitlesAndStories: songs };
  }
}
