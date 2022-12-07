import { Controller, Get, Param } from "@nestjs/common";
import { Song } from "ufo-society1974-definition-types";
import { SongsService } from "./songs.service";

interface SongsResponse {
  songs: Song[];
}

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("albums/:albumId/songs")
  async findSongsByAlbumId(
    @Param("albumId") albumId: string
  ): Promise<SongsResponse> {
    const songs = await this.songsService.findAll(albumId);

    return { songs: [...songs] };
  }
}
