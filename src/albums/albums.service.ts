import { Injectable } from "@nestjs/common";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../converter";
import { PUBLISHED_ALBUMS, PUBLISHED_DATE } from "../constants";

@Injectable()
export class AlbumsService {
  private db: FirebaseFirestore.Firestore;

  async findAll(): Promise<Album[]> {
    try {
      const snapshots = await this.db
        .collection(PUBLISHED_ALBUMS)
        .orderBy(PUBLISHED_DATE, "desc")
        .withConverter(albumConverter)
        .get();

      const albums: Album[] = snapshots.docs.map((snapshot) => {
        const doc = snapshot.data();

        return { ...doc, id: snapshot.id };
      });
      return albums;
    } catch (err) {
      console.error(err);
      return [];
    }
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
}
