
import { DB_NAME, DB_VERSION, STORES } from './constants';
import { addInitialMenuData } from './initialData';

// Initialize the IndexedDB database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.MENU_ITEMS)) {
        const menuStore = db.createObjectStore(STORES.MENU_ITEMS, { keyPath: 'id', autoIncrement: true });
        menuStore.createIndex('category', 'category', { unique: false });
        menuStore.createIndex('name', 'name', { unique: false });

        // Add initial menu data based on the screenshot
        addInitialMenuData(menuStore);
      }

      if (!db.objectStoreNames.contains(STORES.ORDERS)) {
        const orderStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id', autoIncrement: true });
        orderStore.createIndex('timestamp', 'timestamp', { unique: false });
        orderStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PROFILE)) {
        db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.SALES_DATA)) {
        const salesStore = db.createObjectStore(STORES.SALES_DATA, { keyPath: 'id', autoIncrement: true });
        salesStore.createIndex('date', 'date', { unique: false });
        salesStore.createIndex('month', 'month', { unique: false });
        salesStore.createIndex('year', 'year', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.ANALYTICS)) {
        const analyticsStore = db.createObjectStore(STORES.ANALYTICS, { keyPath: 'id', autoIncrement: true });
        analyticsStore.createIndex('type', 'type', { unique: false });
        analyticsStore.createIndex('period', 'period', { unique: false });
      }
    };
  });
};

// Generic CRUD operations for IndexedDB
export const addItem = async <T>(storeName: string, item: T): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item as any);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

export const getItem = async <T>(storeName: string, key: IDBValidKey): Promise<T | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T || null);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

export const getAllItems = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T[]);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

export const updateItem = async <T>(storeName: string, item: T): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item as any);

    request.onsuccess = () => {
      resolve();
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

export const deleteItem = async (storeName: string, key: IDBValidKey): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

// Custom query to get items by index
export const getItemsByIndex = async <T>(
  storeName: string, 
  indexName: string, 
  value: IDBValidKey
): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T[]);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
};

