import type { Album, Song, User } from "ufo-society1974-definition-types";
import { role } from "../constants";
import { RoleType } from "../types";

const mockSongs: Song[] = [
  {
    id: "001",
    lyric: "test song lyric1",
    songFile: null,
    story: "test story1",
    title: "test song title1",
    wordsRights: "test word rights1",
    musicRights: "test music rights1",
  },
  {
    id: "002",
    lyric: "test song lyric2",
    songFile: null,
    story: "test story2",
    title: "test song title2",
    wordsRights: "test word rights2",
    musicRights: "test music rights2",
  },
];

const mockAlbums: Album[] = [
  {
    id: "sample01",
    description: "test description1",
    imageFile: null,
    publishedDate: "20200101",
    title: "test title 1",
  },
  {
    id: "sample02",
    description: "test description2",
    imageFile: null,
    publishedDate: "20200101",
    title: "test title 2",
  },
];

const createTestUser = (uid: string, role: RoleType): User => {
  return {
    isSignedIn: false,
    uid: uid,
    username: "name:" + uid,
    role: role,
    email: uid + "@mail.com",
    isDeleted: false,
  };
};

const deletedUser = {
  ...createTestUser("testuid:deleted", role.WATCHER),
  isDeleted: true,
};

const users: User[] = [
  createTestUser("testuid:editor", role.EDITOR),
  createTestUser("tesiuid:master", role.MASTER),
  createTestUser("testuid:watcher", role.WATCHER),
  deletedUser,
];

export const mockData = {
  songs: mockSongs,
  song: mockSongs[0],
  albums: mockAlbums,
  album: mockAlbums[0],
  users: users,
  user: {
    editor: users[0],
    master: users[1],
    watcher: users[2],
    deletedUser: users[3],
  },
};
