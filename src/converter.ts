import { firestore } from "firebase-admin";
import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Album, Song } from "ufo-society1974-definition-types";
import { CreateAlbumDTO } from "./albums/albums.dto";
import { UserIdAndRole } from "./types";

export const albumConverter: FirestoreDataConverter<CreateAlbumDTO> = {
  toFirestore(album: CreateAlbumDTO): DocumentData {
    return {
      description: album.description,
      imageFile: album.imageFile,
      publishedDate: album.publishedDate,
      title: album.title,
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

export const userConverter: FirestoreDataConverter<UserIdAndRole> = {
  toFirestore(_user: UserIdAndRole) {
    return {};
  },
  fromFirestore(snapshot): UserIdAndRole {
    const data = snapshot.data();

    return {
      uid: data.uid,
      role: data.role,
    };
  },
};
