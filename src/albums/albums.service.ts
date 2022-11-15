import { Injectable } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { mockAlbums } from "../mock/albums";

@Injectable()
export class AlbumsService {
  async getAlbums(): Promise<Album[]> {
    return [...mockAlbums];
  }
}
