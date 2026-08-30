// packages/core/registers/Registry.ts
import { DBController } from "../interfaces/DBController";
import { ImportController } from "../interfaces/ImportController";
import { MediaController } from "./MediaController";

class CoreRegistry {
  private _db: DBController | null = null;
  private _import: ImportController | null = null;
  private _video: MediaController | null = null;
  private _audio: MediaController | null = null;

  // You can register them individually...
  registerDB(controller: DBController) {
    this._db = controller;
  }
  registerImport(controller: ImportController) {
    this._import = controller;
  }
  registerVideo(controller: MediaController) {
    this._video = controller;
  }
  registerAudio(controller: MediaController) {
    this._audio = controller;
  }

  registerAll(controllers: {
    db: DBController;
    import: ImportController;
    video: MediaController;
    audio: MediaController;
  }) {
    this._db = controllers.db;
    this._import = controllers.import;
    this._video = controllers.video;
    this._audio = controllers.audio;
  }

  get db(): DBController {
    if (!this._db) throw new Error("DBController was not registered");
    return this._db;
  }

  get import(): ImportController {
    if (!this._import) throw new Error("ImportController was not registered");
    return this._import;
  }

  get video(): MediaController {
    if (!this._video) throw new Error("MediaController was not registered");
    return this._video;
  }

  get audio(): MediaController {
    if (!this._audio) throw new Error("MediaController was not registered");
    return this._audio;
  }
}

export const Registry = new CoreRegistry();
