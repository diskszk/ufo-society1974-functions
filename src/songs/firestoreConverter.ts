import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Song } from "ufo-society1974-definition-types";

export const songConverter: FirestoreDataConverter<Song> = {
  toFirestore(_song: Song) {
    return {};
  },
  fromFirestore(snapshot): Song {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      lyric: data.lyric,
      songFile: data.songFile,
      story: data.story,
      title: data.title,
      wordsRights: data.wordsRights,
      musicRights: data.musicRights,
    };
  },
};
