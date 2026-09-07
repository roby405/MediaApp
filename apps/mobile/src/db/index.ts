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