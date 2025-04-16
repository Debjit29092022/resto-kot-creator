// IndexedDB Database Service

// Database configuration
const DB_NAME = 'lbw_restaurant_db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  MENU_ITEMS: 'menu_items',
  ORDERS: 'orders',
  PROFILE: 'profile',
  SETTINGS: 'settings',
};

// Initialize the database
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
    };
  });
};

// Add menu data from the screenshot
const addInitialMenuData = (store: IDBObjectStore) => {
  // Traditional Wings
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'AAM KASHMUNDI WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'DARJEELING DALLE WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'STICKY SOY GINGER WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'CLASSIC CRACKLING CHICKEN WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });

  // Boneless Wings
  store.add({
    category: 'BONELESS WINGS',
    name: 'AAM KASHMUNDI BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'BONELESS WINGS IN DALLE KHURSANI SAUCE',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'STICKY SOY GINGER BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'BBQ BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });

  // Wingers
  store.add({
    category: 'WINGERS',
    name: 'AAM KASHMUNDI WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'DALLE KHURSANI SAUCE WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'STICKY SOY GINGER WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'BBQ BONELESS WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'FALAFEL WITH HOT SAUCE HUMMUS BURGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: true
  });

  // Bad Wow (Baos)
  store.add({
    category: 'BAO WOW',
    name: 'SESAME CHICKEN BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: false
  });
  store.add({
    category: 'BAO WOW',
    name: 'CHICKEN TIKKA BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: false
  });
  store.add({
    category: 'BAO WOW',
    name: 'WILD MUSHROOM BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: true
  });
  store.add({
    category: 'BAO WOW',
    name: 'PANEER BHURJI BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: true
  });

  // Add Ons
  store.add({
    category: 'ADD ONS',
    name: 'REGULAR FRIES',
    price: 65,
    isVeg: true
  });
  store.add({
    category: 'ADD ONS',
    name: 'PERI PERI FRIES',
    price: 75,
    isVeg: true
  });
  store.add({
    category: 'ADD ONS',
    name: 'ZINGER FRIES',
    price: 65,
    isVeg: true
  });

  // Signature Beverages
  store.add({
    category: 'SIGNATURE BEVERAGES',
    name: 'CUCUMBER FIZZ',
    price: 75,
    isVeg: true
  });
  store.add({
    category: 'SIGNATURE BEVERAGES',
    name: 'WATERMELON COOLER',
    price: 75,
    isVeg: true
  });

  // Other Beverages
  store.add({
    category: 'OTHER BEVERAGES',
    name: 'BOTTLED WATER (500 ML)',
    price: 0, // MRP
    description: 'MRP',
    isVeg: true
  });
  store.add({
    category: 'OTHER BEVERAGES',
    name: 'COKE/SPRITE/SODA BY THE GLASS',
    price: 30,
    description: '250 ML',
    isVeg: true
  });
};

// Generic CRUD operations
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
