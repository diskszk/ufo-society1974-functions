import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AuthGuard } from "../../auth/auth.guard";
import { role } from "../../constants";
import { Role } from "../../decorators/role.decorator";
import { RoleGuard } from "../../role/role.guard";
import { SongSummary } from "../../types";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums.dto";
import { DraftAlbumsService } from "./draft-albums.service";

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
  constructor(private readonly draftAlbumsService: DraftAlbumsService) {}

  private async checkIsExistAlbum(albumId: string): Promise<void> {
    const isExist = await this.draftAlbumsService.isExist(albumId);
    if (!isExist) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }
    return;
  }

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
    await this.checkIsExistAlbum(albumId);
    return await this.draftAlbumsService.update(album);
  }

  @Delete(":albumId")
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async deleteDraftAlbum(@Param("albumId") albumId: string) {
    await this.checkIsExistAlbum(albumId);

    return await this.draftAlbumsService.delete(albumId);
  }

  /*
    対象のデータをpublished-albumsに作成し、draft-albumsから削除する
  */
  @Post(":albumId/publish")
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async publishDraftAlbum(@Param("albumId") albumId: string) {
    await this.checkIsExistAlbum(albumId);

    const targetDraftAlbum = await this.draftAlbumsService.findById(albumId);

    try {
      return this.draftAlbumsService.publish({ ...targetDraftAlbum }, albumId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
