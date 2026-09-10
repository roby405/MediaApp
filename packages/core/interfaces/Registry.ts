import { dbEventBus } from "../buses/DBEventBus";
import { DBController } from "../interfaces/DBController";
import { MediaFile } from "../types/db";
import { PlatformFile } from "../types/global";

class CoreRegistry {
  private _db: DBController | null = null;

  // You can register them individually...
  registerDB(controller: DBController) {
    this._db = {
      ...controller,
      deleteFile: async (id: string) => {
        await controller.deleteFile(id);
        dbEventBus.emit({ type: "file-delete", id });
      },
      renameFile: async (id: string, newName: string) => {
        await controller.renameFile(id, newName);
        dbEventBus.emit({ type: "file-rename", id, newName });
      },
      updateFile: async (file: MediaFile) => {
        await controller.updateFile(file);
        dbEventBus.emit({ type: "file-update", file });
      },
      saveFile: async (file: MediaFile, source: PlatformFile) => {
        await controller.saveFile(file, source);
        dbEventBus.emit({ type: "file-save", file });
      },
    };
  }

  // registerAll(controllers: {
  //   db: DBController;
  // }) {
  //   this._db = controllers.db;
  // }

  get db(): DBController {
    if (!this._db) throw new Error("DBController was not registered");
    return this._db;
  }
}

export const Registry = new CoreRegistry();
