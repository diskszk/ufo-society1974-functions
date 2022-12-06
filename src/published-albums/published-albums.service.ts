import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../albums-util/albums.converter";
import { CreateAlbumDTO } from "../albums-util/albums.dto";
import { PUBLISHED_ALBUMS, PUBLISHED_DATE } from "../constants";

@Injectable()
export class PublishedAlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly publishedAlbumRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.publishedAlbumRef = this.db.collection(PUBLISHED_ALBUMS);
  }

  async findAll(): Promise<Album[]> {
    const snapshots = (await this.publishedAlbumRef
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get()) as firestore.QuerySnapshot<Album>;

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc };
    });
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = (await this.publishedAlbumRef
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
    return await this.publishedAlbumRef
      .withConverter(albumConverter)
      .add({ ...album });
  }
}
