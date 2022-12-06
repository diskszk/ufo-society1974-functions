import { Injectable } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../albums-util/albums.converter";
import { DRAFT_ALBUMS, PUBLISHED_DATE } from "../constants";
import { firestore } from "firebase-admin";
import { CreateAlbumDTO } from "../albums-util/albums.dto";

@Injectable()
export class DraftAlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly draftAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    // test時にtestを通す為
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.draftAlbumsRef = this.db.collection(DRAFT_ALBUMS);
  }

  async findAll(): Promise<Album[]> {
    const snapshots = await this.draftAlbumsRef
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get();

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc, id: snapshot.id };
    });
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = (await this.draftAlbumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get()) as firestore.DocumentSnapshot<Album>;

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();

    return { ...doc, id: snapshot.id };
  }

  async create(
    album: CreateAlbumDTO
  ): Promise<firestore.DocumentReference<CreateAlbumDTO>> {
    return await this.draftAlbumsRef
      .withConverter(albumConverter)
      .add({ ...album, createdAt: firestore.Timestamp.now() });
  }
}
