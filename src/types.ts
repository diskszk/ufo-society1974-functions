import { Song } from "ufo-society1974-definition-types";
import { role } from "./constants";

const { EDITOR, MASTER, WATCHER } = role;

export type RoleType = typeof EDITOR | typeof MASTER | typeof WATCHER;

export type SongSummary = Pick<Song, "id" | "title" | "story">;
