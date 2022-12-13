import { firestore } from "firebase-admin";
import { DocumentData } from "firebase-admin/firestore";
import { Album } from "ufo-society1974-definition-types";

export const albumConverter = {
  toFirestore(album: Album): DocumentData {
    return {
      description: album.description,
      imageFile: album.imageFile,
      publishedDate: album.publishedDate,
      title: album.title,
      published: false, // 新規作成時は非公開
      createdAt: FirebaseFirestore.Timestamp.now(),
    };
  },
  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>
  ): Album {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      description: data.description,
      publishedDate: data.publishedDate,
      imageFile: data.imageFile,
      title: data.title,
      published: data.published,
      createdAt: data.createdAt,
    };
  },
};
