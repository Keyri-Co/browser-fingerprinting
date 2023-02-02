/**
 * Safari (Safari for iOS & macOS)
 **/

export async function newSafariTest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const tmp_name = String(Math.random());

    try {
      const db = window.indexedDB.open(tmp_name, 1);

      db.onupgradeneeded = function (i) {
        const res = (i.target as any)?.result;

        try {
          res
            .createObjectStore('test', {
              autoIncrement: true,
            })
            .put(new Blob());

          resolve(false);
        } catch (e) {
          let message = e;

          if (e instanceof Error) {
            message = e.message ?? e;
          }

          if (typeof message !== 'string') {
            return resolve(false);
          }

          const matchesExpectedError = /BlobURLs are not yet supported/.test(message);

          return resolve(matchesExpectedError);
        } finally {
          res.close();
          window.indexedDB.deleteDatabase(tmp_name);
        }
      };
    } catch (e) {
      return resolve(false);
    }
  });
}

export async function oldSafariTest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const openDB = (window as any).openDatabase;
    const storage = window.localStorage;
    try {
      openDB(null, null, null, null);
    } catch (e) {
      return resolve(true);
    }
    try {
      storage.setItem('test', '1');
      storage.removeItem('test');
    } catch (e) {
      return resolve(true);
    }
    return resolve(false);
  })
}

export async function safariPrivateTest(): Promise<boolean> {
  let result = false;
  if (navigator.maxTouchPoints !== undefined) {
    result = await newSafariTest();
  } else {
    result = await oldSafariTest();
  }
  return result;
}

/**
 * Chrome
 **/

export function getQuotaLimit(): number {
  const w = window as any;
  if (w.performance !== undefined && w.performance.memory !== undefined && w.performance.memory.jsHeapSizeLimit !== undefined) {
    return (performance as any).memory.jsHeapSizeLimit;
  }
  return 1073741824;
}

// >= 76
export async function storageQuotaChromePrivateTest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    (navigator as any).webkitTemporaryStorage.queryUsageAndQuota(
      function (_: number, quota: number) {
        const quotaInMib = Math.round(quota / (1024 * 1024));
        const quotaLimitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;

        resolve(quotaInMib < quotaLimitInMib);
      },
      function (e: any) {
        reject('detectIncognito somehow failed to query storage quota: ' + e.message);
      },
    );
  })
}

// 50 to 75
export async function oldChromePrivateTest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const fs = (window as any).webkitRequestFileSystem;
    const success = function () {
      resolve(false);
    };
    const error = function () {
      resolve(true);
    };
    fs(0, 1, success, error);
  })
}

export async function chromePrivateTest(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    let result = false;
    if (self.Promise !== undefined && (self.Promise as any).allSettled !== undefined) {
      result = await storageQuotaChromePrivateTest();
    } else {
      result = await oldChromePrivateTest();
    }
    resolve(result);
  })
}

/**
 * Firefox
 **/

export function firefoxPrivateTest(): boolean {
  return navigator.serviceWorker === undefined;
}

/**
 * MSIE
 **/

export function msiePrivateTest(): boolean {
  return window.indexedDB === undefined;
}
