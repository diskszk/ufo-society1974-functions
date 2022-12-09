import { Controller, Get, Param } from "@nestjs/common";
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
    const songs = await this.songsService.findAllSongTitleAndStories(albumId);

    return { songTitlesAndStories: songs };
  }
}
