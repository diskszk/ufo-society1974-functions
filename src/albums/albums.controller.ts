import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AuthGuard } from "../auth/auth.guard";
import { role } from "../constants";
import { Role } from "../decorators/role.decorator";
import { RoleGuard } from "../role/role.guard";
import { SongsService } from "../songs/songs.service";
import { SongSummary } from "../types";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsService } from "./albums.service";

interface AlbumsResponse {
  albums: Album[];
  info?: {
    albumId: string;
    songSummaries: SongSummary[];
  };
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

    return { albums };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async createAlbum(@Body() album: CreateAlbumDTO) {
    return this.albumsService.create(album);
  }

  @Get(":albumId")
  async findAlbumAndSummary(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    const songSummaries = await this.songsService.findAllSongSummariesByAlbumId(
      albumId
    );

    return { albums: [album], info: { albumId, songSummaries } };
  }

  @Put(":albumId")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async setPublish(
    @Param("albumId") albumId: string,
    @Query("published") published: boolean
  ) {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    if (published === true) {
      if (album.published === true) {
        throw new BadRequestException("IDと一致するアルバムは既に公開中です。");
      }

      return await this.albumsService.setPublish(albumId);
    } else {
      if (album.published === false) {
        throw new BadRequestException("IDと一致するアルバムは既に非公開です。");
      }
      return await this.albumsService.setUnpublish(albumId);
    }
  }

  @Delete(":albumId")
  @UseGuards(AuthGuard)
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async deleteAlbum(@Param("albumId") albumId: string) {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return await this.albumsService.delete(albumId);
  }
}
