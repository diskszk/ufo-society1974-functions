import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Album, Song } from "ufo-society1974-definition-types";

export const albumConverter: FirestoreDataConverter<Album> = {
  toFirestore(_album: Album) {
    return {};
  },
  fromFirestore(snapshot): Album {
    const data = snapshot.data();

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageFile: data.imageFile,
      publishedDate: data.publishedDate,
      songs: data.songs,
      publishPlatform: data.publishPlatform,
    };
  },
};

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
