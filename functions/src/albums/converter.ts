import { FirestoreDataConverter } from "firebase-admin/firestore";
import { Album } from "ufo-society1974-definition-types";

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
