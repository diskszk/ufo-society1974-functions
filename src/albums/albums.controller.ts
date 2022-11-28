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
import { UsersService } from "../users/users.service";
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
      throw new HttpException("Missing Album Id", 404);
    }

    return album;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createAlbum(
    @Body() album: CreateAlbumDTO,
    @UserGuardDecorator() uid: string
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    // パラメータからuidを取得したuidでuserをfirestoreから取得し、
    // 取得したuser.roleでバリデーションを行う
    const user = await this.usersService.findById(uid);

    if (!user) {
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
    }

    if (user.role !== "editor") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    return await this.albumsService.create(album);
  }
}
