import { firestore } from "firebase-admin";
import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Album } from "ufo-society1974-definition-types";
import { CreateAlbumDTO } from "./albums.dto";

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
