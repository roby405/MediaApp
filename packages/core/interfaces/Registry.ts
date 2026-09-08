import { DBController } from "../interfaces/DBController";

class CoreRegistry {
  private _db: DBController | null = null;

  // You can register them individually...
  registerDB(controller: DBController) {
    this._db = controller;
  }

  registerAll(controllers: {
    db: DBController;
  }) {
    this._db = controllers.db;
  }

  get db(): DBController {
    if (!this._db) throw new Error("DBController was not registered");
    return this._db;
  }
}

export const Registry = new CoreRegistry();
