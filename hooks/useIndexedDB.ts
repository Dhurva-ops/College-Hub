import { useState, useEffect } from 'react';

const DB_NAME = 'CollegeHubDB';
const DB_VERSION = 2;
const STORE_NAME = 'college_data_store';

export function useIndexedDB<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    let isMounted = true;
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const getRequest = objectStore.get(key);

      getRequest.onsuccess = () => {
        if (isMounted && getRequest.result !== undefined) {
          setStoredValue(getRequest.result);
        }
      };
      
      getRequest.onerror = () => {
          console.error(`Error fetching key ${key} from IndexedDB`);
      };
    };

    request.onerror = (event) => {
        console.error("IndexedDB error:", event);
    };

    return () => { isMounted = false; };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        objectStore.put(valueToStore, key);
      };

      return valueToStore;
    });
  };

  return [storedValue, setValue];
}