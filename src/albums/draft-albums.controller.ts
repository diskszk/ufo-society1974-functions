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

// CMSアプリから使う想定
@Controller("draft-albums")
@UseGuards(AuthGuard)
export class DraftAlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAllDraftedAlbums(): Promise<AlbumsResponse> {
    const draftedAlbums = await this.albumsService.findDrafted();

    return { albums: draftedAlbums };
  }

  @Post()
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async createAlbum(@Body() album: CreateAlbumDTO) {
    return this.albumsService.create(album);
  }

  @Put(":albumId")
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
