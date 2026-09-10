import { MediaFile } from "../types/db";

export type DBEvent =
  | { type: "file-save"; file: MediaFile }
  | { type: "file-delete"; id: string }
  | { type: "file-rename"; id: string; newName: string }
  | { type: "file-update"; file: MediaFile };

export type Listener = (event: DBEvent) => void;

class DBEventBus {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: DBEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const dbEventBus = new DBEventBus();