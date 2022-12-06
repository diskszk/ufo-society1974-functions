import { mockData } from "../mock";
import { CreateAlbumDTO } from "./albums.dto";

export class DummyAlbumsService {
  async findAll() {
    return [...mockData.albums];
  }

  async findById(id: string) {
    return id === "sample001" ? mockData.albums[0] : null;
  }

  async create(
    albumDTO: CreateAlbumDTO
  ): Promise<FirebaseFirestore.DocumentReference<CreateAlbumDTO>> {
    return null;
  }
}
