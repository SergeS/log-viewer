

export const deleteDatabase = async (dbName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.deleteDatabase(dbName);

    req.onerror = () => {
      reject(req.error);
    }

    req.onsuccess = () => {
      resolve();
    }
  });
};

export const open = async (dbName: string, version: number, setup: (db: IDBDatabase) => void): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(dbName, version);

    req.onerror = () => {
      reject(req.error);
    }

    req.onsuccess = () => {
      resolve(req.result);
    }

    req.onupgradeneeded = () => {
      const db = req.result;
      db.onerror = (ev: Event) => {
        reject(new Error('Failed to set-up db'));
      }

      setup(db);

      db.onerror = null;
//      resolve(db);
    }
  });
}

