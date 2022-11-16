import { Injectable } from "@nestjs/common";
import { Song } from "ufo-society1974-definition-types";
import { connectFirestore } from "../connectFirestore";
import { PUBLISHED_ALBUMS, SONGS } from "../constants";
import { songConverter } from "../converter";

const { db } = connectFirestore();

@Injectable()
export class SongsService {
  async findAll(albumId: string): Promise<Song[]> {
    const songsRef = db
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
