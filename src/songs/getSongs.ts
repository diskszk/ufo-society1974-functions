import { Song } from "ufo-society1974-definition-types";
import { refs } from "..";
import { songConverter } from "../converter";

export async function getSongs(albumId: string): Promise<Song[]> {
  const snapshots = await refs
    .songsRef(albumId)
    .orderBy("id")
    .withConverter(songConverter)
    .get();

  if (snapshots.empty) {
    throw new Error("data is not exists");
  }

  const songs: Song[] = snapshots.docs.map((snapshot) => {
    const doc = snapshot.data();

    return { ...doc, id: snapshot.id };
  });

  return songs;
}
