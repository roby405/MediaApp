/* eslint-disable @typescript-eslint/no-unused-vars */
import { openDB, type IDBPDatabase } from "idb";
import type { AppDB } from "./schema";

const DB_NAME = "MediaDB";
const DB_VERSION = 1;

let dbPromise : Promise<IDBPDatabase<AppDB>> | null = null;

export function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
            upgrade(db, _oldVer, _newVer, _transaction) {
                if (!db.objectStoreNames.contains("files")) {
                    const fileStore = db.createObjectStore("files", {
                        keyPath: 'id',
                    });
                    fileStore.createIndex("by_category", "category");
                    fileStore.createIndex("by_created_at", "created_at")
                    fileStore.createIndex("by_size", "size")
                    fileStore.createIndex("by_extension", "extension")
                    fileStore.createIndex("by_category_and_created_at", ["category", "created_at"])
                }
            }
        });
    }
    return dbPromise;
}