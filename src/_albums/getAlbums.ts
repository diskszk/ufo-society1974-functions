import { Album } from "ufo-society1974-definition-types";
import { refs } from "../index";
import { albumConverter } from "../converter";

export async function getAlbums(): Promise<Album[]> {
  const snapshots = await refs.albumsRef
    .orderBy("publishedDate", "desc")
    .withConverter(albumConverter)
    .get();

  if (snapshots.empty) {
    throw new Error("data is not exists");
  }

  const albums: Album[] = snapshots.docs.map((snapshot) => {
    const doc = snapshot.data();

    return { ...doc, id: snapshot.id };
  });

  return albums;
}
