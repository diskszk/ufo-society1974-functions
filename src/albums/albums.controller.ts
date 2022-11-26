import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsService } from "./albums.service";

@Controller("albums")
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(":albumId")
  async findById(@Param("albumId") albumId: string): Promise<Album> {
    const album = await this.albumsService.findById(albumId);
    if (!album) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Missing album id.",
        },
        404
      );
    }

    return album;
  }

  @Post()
  async createAlbum(
    @Body() album: CreateAlbumDTO
  ): Promise<FirebaseFirestore.WriteResult> {
    return await this.albumsService.create(album);
  }
}
