import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('MediaDB.db');

export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      extension TEXT NOT NULL,
      path TEXT NOT NULL,
      size INTEGER NON NULL,
      created_at INTEGER NOT NULL,
      cover TEXT,
      last_opened_at INTEGER NOT NULL,
      is_favourite INTEGER NOT NULL,
      category TEXT NOT NULL,
      METADATA TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS by_category ON files (category);
    CREATE INDEX IF NOT EXISTS by_created_at ON files (created_at);
    CREATE INDEX IF NOT EXISTS by_size ON files (size);
    CREATE INDEX IF NOT EXISTS by_extension ON files (extension);
    CREATE INDEX IF NOT EXISTS by_category_and_created_at ON files (category, created_at);
    `);
}

// // import { openDB, type IDBPDatabase } from "idb";
// import type { AppDB } from "./schema";

// const DB_NAME = "MediaDB";
// const DB_VERSION = 1;

// // let dbPromise : Promise<IDBPDatabase<AppDB>> | null = null;

// export function getDB() {
//     if (!dbPromise) {
//         dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
//             upgrade(db, _oldVer, _newVer, _transaction) {
//                 if (!db.objectStoreNames.contains("files")) {
//                     const fileStore = db.createObjectStore("files", {
//                         keyPath: 'id',
//                     });
//                     fileStore.createIndex("by_category", "category");
//                     fileStore.createIndex("by_created_at", "created_at")
//                     fileStore.createIndex("by_size", "size")
//                     fileStore.createIndex("by_extension", "extension")
//                     fileStore.createIndex("by_category_and_created_at", ["category", "created_at"])
//                 }
//             }
//         });
//     }
//     return dbPromise;
// }