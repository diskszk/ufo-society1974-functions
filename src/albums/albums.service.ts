import { Injectable } from "@nestjs/common";
import { albumConverter } from "../converter";
import { Album } from "ufo-society1974-definition-types";

import { PUBLISHED_ALBUMS, PUBLISHED_DATE } from "../constants";
import { connectFirestore } from "../connectFirestore";

const { db } = connectFirestore();

@Injectable()
export class AlbumsService {
  async getAlbums(): Promise<Album[]> {
    const snapshots = await db
      .collection(PUBLISHED_ALBUMS)
      .orderBy(PUBLISHED_DATE, "desc")
      .withConverter(albumConverter)
      .get();

    const albums: Album[] = snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc, id: snapshot.id };
    });
    return albums;
  }
}
