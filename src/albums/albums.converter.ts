import { firestore } from "firebase-admin";
import { DocumentData, FirestoreDataConverter } from "firebase-admin/firestore";
import { Album } from "ufo-society1974-definition-types";
import { CreateAlbumDTO } from "./albums.dto";

export const albumConverter: FirestoreDataConverter<Album | CreateAlbumDTO> = {
  toFirestore(album: CreateAlbumDTO): DocumentData {
    return { ...album };
  },
  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>
  ): Album {
    const data = snapshot.data();

    return {
      id: data.id,
      description: data.description,
      publishedDate: data.publishedDate,
      imageFile: data.imageFile,
      title: data.title,
      published: data.published,
      createdAt: data.createdAt,
    };
  },
};
