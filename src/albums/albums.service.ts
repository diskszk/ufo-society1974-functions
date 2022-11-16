import { Injectable } from "@nestjs/common";
import { albumConverter } from "../converter";
import { Album } from "ufo-society1974-definition-types";

import { PUBLISHED_ALBUMS, PUBLISHED_DATE } from "../constants";
import { connectFirestore } from "../connectFirestore";

const { db } = connectFirestore();

@Injectable()
export class AlbumsService {
  private readonly albumsRef = db.collection(PUBLISHED_ALBUMS);

  async findAll(): Promise<Album[]> {
    const snapshots = await this.albumsRef
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get();

    const albums: Album[] = snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc, id: snapshot.id };
    });
    return albums;
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = await this.albumsRef
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
