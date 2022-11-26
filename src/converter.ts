import { firestore } from "firebase-admin";
import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Album, Song } from "ufo-society1974-definition-types";
import { User } from "./users/users.service";

export const albumConverter: FirestoreDataConverter<Album> = {
  toFirestore(album: Album): DocumentData {
    return {
      description: album.description,
      imageFile: album.imageFile,
      publishedDate: album.publishedDate,
      title: album.title,
      id: album.id,
      createdAt: firestore.Timestamp.now(),
    };
  },
  fromFirestore(snapshot): Album {
    const data = snapshot.data();

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageFile: data.imageFile,
      publishedDate: data.publishedDate,
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

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(_user: User) {
    return {};
  },
  fromFirestore(snapshot): User {
    const data = snapshot.data();

    return {
      uid: data.uid,
      displayName: data.displayName,
      email: data.email,
      role: data.role,
    };
  },
};
