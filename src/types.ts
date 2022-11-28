import { role } from "./constants";

const { EDITOR, MASTER, WATCHER } = role;
export type UserIdAndRole = {
  uid: string;
  role: typeof EDITOR | typeof MASTER | typeof WATCHER;
};
