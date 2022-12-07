import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { AuthGuard } from "../auth/auth.guard";
import { CreateAlbumDTO } from "../albums-util/albums.dto";
import { DraftAlbumsService } from "./draft-albums.service";
import { RoleGuard } from "../role/role.guard";
import { Role } from "../decorators/role.decorator";

interface DraftAlbumsResponse {
  draftAlbums: Album[];
}

@Controller("draft-albums")
@UseGuards(AuthGuard)
export class DraftAlbumsController {
  constructor(private readonly albumsService: DraftAlbumsService) {}

  @Get()
  async findAll(): Promise<DraftAlbumsResponse> {
    const albums = await this.albumsService.findAll();
    return { draftAlbums: albums };
  }

  @Get(":albumId")
  async findById(
    @Param("albumId") albumId: string
  ): Promise<DraftAlbumsResponse> {
    const album = await this.albumsService.findById(albumId);
    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return { draftAlbums: [album] };
  }

  @Post()
  @Role(role.EDITOR)
  @UseGuards(RoleGuard)
  async createAlbum(
    @Body() album: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return await this.albumsService.create(album);
  }
}
