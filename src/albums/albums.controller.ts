import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { AlbumsService } from "./albums.service";

interface AlbumsResponse {
  albums: Album[];
}

@Controller("albums")
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAlbums(): Promise<AlbumsResponse> {
    const albums = await this.albumsService.findAll();

    return { albums: albums };
  }

  @Get(":albumId")
  async findOne(@Param("albumId") albumId: string): Promise<AlbumsResponse> {
    const album = await this.albumsService.findById(albumId);

    if (!album) {
      throw new NotFoundException("IDと一致するアルバムは存在しません。");
    }

    return { albums: [album] };
  }
}
