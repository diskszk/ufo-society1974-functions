import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Song } from "ufo-society1974-definition-types";
import { CreateSongDTO } from "./songs.dto";

export const songConverter: FirestoreDataConverter<Song | CreateSongDTO> = {
  toFirestore(song: Song): DocumentData {
    return {
      lyric: song.lyric,
      story: song.story,
      title: song.title,
      wordsRights: song.wordsRights,
      musicRights: song.musicRights,
      songFile: song.songFile,
    };
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>
  ): Song {
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
