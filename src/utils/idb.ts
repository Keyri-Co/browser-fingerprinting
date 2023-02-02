export class IndexDB {
  private db: IDBDatabase | null = null;
  private errors = {
    notInitialized: 'DB not initialized',
  };

  async connect(dbName: string, dbVersion = 1, onUpgradeNeeded?: (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open(dbName, dbVersion);

      openRequest.onerror = function () {
        reject(openRequest.error);
      };

      if (onUpgradeNeeded) openRequest.onupgradeneeded = onUpgradeNeeded;

      openRequest.onsuccess = () => {
        this.db = openRequest.result;

        this.db.onversionchange = () => {
          this.db?.close();
          location.reload();
        };

        openRequest.onblocked = function () {
          console.error('Please close or refresh all other tabs with this app');
        };
        resolve(this);
      };
    });
  }

  createTransaction(storeName: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.db) throw new Error(this.errors.notInitialized);
    const transaction = this.db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    // transaction.oncomplete = function () {
    //   console.log('Transaction successfully complete');
    // };

    transaction.onabort = function () {
      console.error('Transaction was aborted: ', transaction.error?.message);
    };

    return store;
  }

  async getByKey(store: IDBObjectStore, key: string): Promise<Record<string, any>> {
    if (!this.db) throw new Error(this.errors.notInitialized);
    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error?.message)
      };
    })
  }

  async put(store: IDBObjectStore, object: any, key?: string) {
    if (!this.db) throw new Error(this.errors.notInitialized);
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      if (key) {
        request = store.put(object, key);
      } else {
        request = store.put(object);
      }

      request.onerror = function () {
        reject(request.error?.message)
      };

      request.onsuccess = function () {
        resolve(request.result);
      };
    })
  }
}
