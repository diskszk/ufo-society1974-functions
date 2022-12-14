import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Song } from "ufo-society1974-definition-types";
import { AuthGuard } from "../auth/auth.guard";
import { role } from "../constants";
import { Role } from "../decorators/role.decorator";
import { RoleGuard } from "../role/role.guard";
import { CreateSongDTO } from "./songs.dto";
import { SongsService } from "./songs.service";

interface SongsResponse {
  songs: Song[];
}

@Controller("albums/:albumId/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  private async checkIsExistAlbum(albumId: string) {
    const result = await this.songsService.findIsAlbumExists(albumId);

    if (!result) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }
    return;
  }

  @Post()
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async createSong(
    @Param("albumId") albumId: string,
    @Body() song: CreateSongDTO
  ) {
    await this.checkIsExistAlbum(albumId);

    return this.songsService.create(albumId, song);
  }

  @Get(":songId")
  async getSongById(
    @Param("albumId") albumId: string,
    @Param("songId") songId: string
  ): Promise<SongsResponse> {
    await this.checkIsExistAlbum(albumId);

    const song = await this.songsService.findSongById(albumId, songId);

    if (!song) {
      throw new NotFoundException("IDと一致する楽曲は存在しません。");
    }

    return { songs: [song] };
  }

  @Delete(":songId")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async deleteSong(
    @Param("albumId") albumId: string,
    @Param("songId") songId: string
  ) {
    await this.checkIsExistAlbum(albumId);

    const song = await this.songsService.findSongById(albumId, songId);

    if (!song) {
      throw new NotFoundException("IDと一致する楽曲は存在しません。");
    }

    return await this.deleteSong(albumId, songId);
  }
}
