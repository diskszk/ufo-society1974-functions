import { Album } from "ufo-society1974-definition-types";
import { albumsRef } from "../index";

export const fetchAlbums = async (): Promise<Album[]> => {
  const snapshots = await albumsRef.get();

  if (snapshots.empty) {
    throw new Error("data is not exists");
  }

  const albums: Album[] = snapshots.docs.map((snapshot) => {
    const doc = snapshot.data();

    return { ...(doc as Album) };
  });

  return albums;
};
