import { role } from "./constants";

const { EDITOR, MASTER, WATCHER } = role;

export type RoleType = typeof EDITOR | typeof MASTER | typeof WATCHER;
