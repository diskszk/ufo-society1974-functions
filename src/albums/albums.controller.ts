import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { UserGuardDecorator } from "../decorators/UserGuardDecorator";
import { AuthGuard } from "../guard/auth.guard";
import { FirebaseUserInfo, UsersService } from "../users/users.service";
import { CreateAlbumDTO } from "./albums.dto";
import { AlbumsService } from "./albums.service";

@Controller("albums")
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly usersService: UsersService
  ) {}

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
  @UseGuards(AuthGuard)
  async createAlbum(
    @Body() album: CreateAlbumDTO,
    @UserGuardDecorator() userInfo: FirebaseUserInfo
  ): Promise<FirebaseFirestore.WriteResult> {
    const user = await this.usersService.findById(userInfo.uid);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: HttpException.toString(),
        },
        404
      );
    }

    if (user.role !== "editor") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: HttpException.toString(),
        },
        403
      );
    }

    return await this.albumsService.create(album);
  }
}
