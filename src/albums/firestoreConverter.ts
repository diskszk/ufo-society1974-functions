import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Album } from "ufo-society1974-definition-types";

export const albumConverter: FirestoreDataConverter<Album> = {
  toFirestore(album: Album): DocumentData {
    return {
      description: album.description,
      imageFile: album.imageFile,
      publishedDate: album.publishedDate,
      title: album.title,
    };
  },
  fromFirestore(snapshot): Album {
    const data = snapshot.data();

    return {
      id: data.id,
      description: data.description,
      publishedDate: data.publishedDate,
      imageFile: data.imageFile,
      title: data.title,
    };
  },
};
