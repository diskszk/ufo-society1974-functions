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
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AuthGuard } from "../auth/auth.guard";
import { role } from "../constants";
import { Role } from "../decorators/role.decorator";
import { RoleGuard } from "../role/role.guard";
import { SongSummary } from "../types";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums/albums.dto";
import { DraftAlbumsService } from "./draft-albums.service";
import { AlbumsService } from "../albums/albums.service";

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
  constructor(
    private readonly draftAlbumsService: DraftAlbumsService,
    private readonly publishedAlbumService: AlbumsService
  ) {}

  @Get()
  async findAllDraftAlbums(): Promise<AlbumsResponse> {
    const draftedAlbums = await this.draftAlbumsService.findAll();

    return { albums: draftedAlbums };
  }

  @Post()
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async createDraftAlbum(@Body() album: CreateAlbumDTO) {
    return await this.draftAlbumsService.create(album);
  }

  @Get(":albumId")
  async findDraftAlbumById(
    @Param("albumId") albumId: string
  ): Promise<AlbumsResponse> {
    const draftAlbum = await this.draftAlbumsService.findById(albumId);

    return { albums: [draftAlbum] };
  }

  @Put(":albumId")
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async updateDraftAlbum(
    @Body() album: UpdateAlbumDTO,
    @Param("albumId") albumId: string
  ) {
    const isExistAlbum = Boolean(
      await this.draftAlbumsService.findById(albumId)
    );

    if (!isExistAlbum) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }
    return await this.draftAlbumsService.update(album);
  }

  @Delete(":albumId")
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async deleteDraftAlbum(@Param("albumId") albumId: string) {
    const album = await this.draftAlbumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return await this.draftAlbumsService.delete(albumId);
  }

  @Post(":albumId/publish")
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async setPublish(
    @Param("albumId") albumId: string
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    const targetAlbum = await this.draftAlbumsService.findById(albumId);

    const isExistDraftAlbum = Boolean(targetAlbum);

    if (!isExistDraftAlbum) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    const isExistPublishedAlbum = Boolean(
      await this.publishedAlbumService.findById(albumId)
    );

    if (isExistPublishedAlbum) {
      throw new BadRequestException("IDと一致するアルバムは既に公開中です。");
    }

    return await this.draftAlbumsService.publish(targetAlbum);
  }
}
