import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "./albums.converter";
import { CreateAlbumDTO } from "./albums.dto";
import { ALBUMS, PUBLISHED_DATE } from "../constants";

@Injectable()
export class AlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly albumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.albumsRef = this.db.collection(ALBUMS);
  }

  async findAll(): Promise<Album[]> {
    const snapshots = (await this.albumsRef
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get()) as firestore.QuerySnapshot<Album>;

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc };
    });
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = (await this.albumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get()) as firestore.DocumentSnapshot<Album>;

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();
    return { ...doc };
  }

  // albums/:idのリソースsongsを含めてコピーする
  async create(
    album: CreateAlbumDTO
  ): Promise<firestore.DocumentReference<CreateAlbumDTO>> {
    return await this.albumsRef.withConverter(albumConverter).add({ ...album });
  }
}
