import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { Song } from "ufo-society1974-definition-types";
import { SongsService } from "./songs.service";

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("albums/:albumId/songs")
  async findSongsByAlbumId(@Param("albumId") albumId: string): Promise<Song[]> {
    const songs = await this.songsService.findAll(albumId);

    if (!songs) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Missing album id.",
        },
        404
      );
    }

    return songs;
  }
}
