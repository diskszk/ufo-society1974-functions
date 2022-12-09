import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { ALBUMS, SONGS } from "../constants";
import { SongTitleAndStory } from "../types";
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

  async findAllSongTitleAndStories(
    albumId: string
  ): Promise<SongTitleAndStory[]> {
    const songsRef = this.db
      .collection(ALBUMS)
      .doc(albumId)
      .collection(SONGS)
      .orderBy("id")
      .withConverter(songConverter);

    const snapshots = await songsRef.get();
    const songTitlesAndStories: SongTitleAndStory[] = snapshots.docs.map(
      (snapshot) => {
        const doc = snapshot.data();

        return { ...doc };
      }
    );

    return songTitlesAndStories;
  }
}
