import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Song } from "ufo-society1974-definition-types";
import { PUBLISHED_ALBUMS, SONGS } from "../constants";
import { songConverter } from "./songs.converter";

@Injectable()
export class SongsService {
  private readonly db: firestore.Firestore;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    } else {
      this.db = firestore();
    }
  }

  async findAll(albumId: string): Promise<Song[]> {
    const songsRef = this.db
      .collection(PUBLISHED_ALBUMS)
      .doc(albumId)
      .collection(SONGS)
      .orderBy("id")
      .withConverter(songConverter);

    const snapshots = await songsRef.get();
    const songs: Song[] = snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc, id: snapshot.id };
    });

    return songs;
  }
}
