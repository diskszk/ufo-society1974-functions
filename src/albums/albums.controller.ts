import { Controller, Get } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AlbumsService } from "./albums.service";

@Controller("albums")
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAlbums(): Promise<Album[]> {
    return this.albumsService.getAlbums();
  }
}
