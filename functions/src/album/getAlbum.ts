import { Album } from "ufo-society1974-definition-types";
import { refs } from "..";
import { albumConverter } from "../converter";

export async function getAlbum(id: string): Promise<Album> {
  const snapshot = await refs.albumsRef
    .doc(id)
    .withConverter(albumConverter)
    .get();

  const doc = snapshot.data();

  if (!snapshot.exists || !doc) {
    throw new Error("data is not exists");
  }

  const album: Album = { ...doc, id: snapshot.id };

  return album;
}
