import { Injectable } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../converter";
import { ALBUMS, PUBLISHED_ALBUMS, PUBLISHED_DATE } from "../constants";
import { firestore } from "firebase-admin";
import { CreateAlbumDTO } from "./albums.dto";

@Injectable()
export class AlbumsService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    // test時にtestを通す為
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
  }

  async findAll(): Promise<Album[]> {
    const snapshots = await this.db
      .collection(PUBLISHED_ALBUMS)
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get();

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc, id: snapshot.id };
    });
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = await this.db
      .collection(PUBLISHED_ALBUMS)
      .doc(id)
      .withConverter(albumConverter)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();

    return { ...doc, id: snapshot.id };
  }

  async create(
    album: CreateAlbumDTO
  ): Promise<firestore.DocumentReference<CreateAlbumDTO>> {
    const albumsRef = this.db.collection(ALBUMS);

    return await albumsRef.withConverter(albumConverter).add(album);
  }
}
