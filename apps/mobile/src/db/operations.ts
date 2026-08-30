import { getMediaUrl } from "src/utils/getMediaUrl";
import { db } from ".";
import * as FileSystem from "expo-file-system";
import { MediaFile } from "@media-app/core/types/db";
import { MediaType } from "@media-app/core/types/global";

export const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;
export const SETTINGS_DIR = `${FileSystem.documentDirectory}settings/`;
export const COVER_DIR = `${FileSystem.documentDirectory}cover/`;

export async function makeSureDirsExist() {
  const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
  }

  const dirInfo2 = await FileSystem.getInfoAsync(SETTINGS_DIR);
  if (!dirInfo2.exists) {
    await FileSystem.makeDirectoryAsync(SETTINGS_DIR, { intermediates: true });
  }
  const dirInfo3 = await FileSystem.getInfoAsync(COVER_DIR);
  if (!dirInfo3.exists) {
    await FileSystem.makeDirectoryAsync(COVER_DIR, { intermediates: true });
  }
}

function parseMedia(row: any): MediaFile {
  return {
    ...row,
    metadata: JSON.parse(row.metadata),
  };
}

export async function saveFile(
  file: MediaFile,
  source: string,
  coverSource = "",
) {
  await makeSureDirsExist();
  const coverDest = `${COVER_DIR}${file.id}.webp`;
  await FileSystem.copyAsync({
    from: source,
    to: file.path,
  });

  if (file.cover && coverSource) {
    await FileSystem.copyAsync({
      from: coverSource,
      to: coverDest,
    });
  }

  const dbFormat = db.prepareSync(`INSERT OR REPLACE INTO files 
    (id, name, extension, path, size, created_at, cover, last_opened_at, is_favourite, category, metadata) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  dbFormat.executeSync([
    file.id,
    file.name,
    file.extension,
    file.path,
    file.size,
    file.created_at,
    file.cover,
    file.last_opened_at,
    file.is_favourite,
    file.category,
    JSON.stringify(file.metadata),
  ]);
}

export async function updateFile(file: MediaFile) {
  // const db = await getDB();
  const dbFormat = db.prepareSync(`UPDATE files SET
    name = ?, extension = ?, path = ?, size = ?, created_at = ?, cover = ?, last_opened_at = ?, is_favourite = ?, category = ?, metadata = ?
    WHERE id = ?
    `);

  dbFormat.executeSync([
    file.name,
    file.extension,
    file.path,
    file.size,
    file.created_at,
    file.cover,
    file.last_opened_at,
    file.is_favourite,
    file.category,
    JSON.stringify(file.metadata),
    file.id,
  ]);
}

// CHANGED: Made async to match Web
export async function getFile(id: string): Promise<MediaFile | null> {
  const row = db.getFirstAsync(`SELECT * FROM files WHERE id = ?`, id);
  return row ? parseMedia(row) : null;
}

export function getFileSync(id: string): MediaFile | null {
  const row = db.getFirstSync(`SELECT * FROM files WHERE id = ?`, id);
  return row ? parseMedia(row) : null;
}

export async function getFileContent(id: string) {
  const uri = getMediaUrl(id);
  if (!uri) return null;

  const res = await fetch(uri);
  return await res.arrayBuffer();
}

export async function renameFile(id: string, newName: string) {
  const dbFormat = db.prepareSync(`UPDATE files SET name = ? WHERE id = ?`);
  dbFormat.executeSync([newName, id]);
}

// CHANGED: Made async to match Web
export async function getAllFiles(): Promise<MediaFile[]> {
  return db.getAllSync("SELECT * FROM files").map(parseMedia);
}

// CHANGED: Made async to match Web
export async function getFilesByCategory<T extends MediaType>(
  category: T,
): Promise<Extract<MediaFile, { category: T }>[]> {
  const rows = db.getAllSync('SELECT * FROM files WHERE category = ?', category);
  return rows.map(parseMedia) as Extract<MediaFile, { category: T }>[];
}

export async function deleteFile(id: string) {
  const file = await getFile(id);

  if (file && file.path) {
    try {
      await FileSystem.deleteAsync(file.path, { idempotent: true });
    } catch (err) {
      console.error(`Couldn't delete file: ${err}`);
    }
  }

  const dbFormat = db.prepareAsync(`DELETE FROM files WHERE id = ?`);
  (await dbFormat).executeAsync(id);
}