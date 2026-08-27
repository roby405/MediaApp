import { getDB } from ".";
import type { MediaType } from "../types/global";
import type { MediaFile } from "./schema";

async function getOpfsRoot() {
  return await navigator.storage.getDirectory();
}

export async function saveFile(file: MediaFile, rawFile: File) {
  const root = await getOpfsRoot();
  const fileHandle = await root.getFileHandle(file.id, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(rawFile);
  await writable.close();
  
  const db = await getDB();
  return db.add("files", file);
}

export async function updateFile(file: MediaFile) {
  const db = await getDB();
  return db.put("files", file);
}

export async function getFileContent(id: string) {
  try {
    const root = await getOpfsRoot();
    const fileHandle = await root.getFileHandle(id);
    return await fileHandle.getFile();
  } catch (err) {
    console.error(`Couldn't get the file with id ${id}: ${err}`);
    return null;
  }
}

export async function getFile(id: string) {
  const db = await getDB();
  return db.get("files", id);
}

export async function renameFile(id: string, newName: string) {
  const file = await getFile(id);
  if (file) {
    file.name = newName;
    await updateFile(file);
  }
}

export async function getAllFiles() {
  const db = await getDB();
  return db.getAll("files");
}

export async function getFilesByCategory<T extends MediaType>(
  category: T,
): Promise<Extract<MediaFile, { category: T }>[]> {
  const db = await getDB();
  const files = (await db.getAllFromIndex(
    "files",
    "by_category",
    category,
  )) as Extract<MediaFile, { category: T }>[];
  return files;
}

export async function deleteFile(id: string) {
  try {
    const root = await getOpfsRoot();
    await root.removeEntry(id);
  } catch (error) {
    console.warn(`File ${id} not found in OPFS or already deleted.`, error);
  }

  const db = await getDB();
  return db.delete("files", id);
}
