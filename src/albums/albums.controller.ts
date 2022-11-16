import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AlbumsService } from "./albums.service";

@Controller("albums")
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  fetchAlbums(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(":albumId")
  async findAlbumById(@Param("albumId") albumId: string): Promise<Album> {
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
}
