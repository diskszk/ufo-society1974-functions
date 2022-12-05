import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { AuthGuard } from "../auth/auth.guard";
import { UserRoleInterceptor } from "../interceptor/userRole.interceptor";
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
      throw new HttpException("Missing Album Id", 404);
    }

    return album;
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(new UserRoleInterceptor(role.EDITOR))
  async createAlbum(
    @Body() album: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return await this.albumsService.create(album);
  }
}
