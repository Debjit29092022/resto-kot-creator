
// Database Service with IndexedDB and SQLite support

// Database configuration
const DB_NAME = 'lbw_restaurant_db';
const DB_VERSION = 1;
const SQLITE_DB_NAME = 'lbw_restaurant.db';

// Store names
export const STORES = {
  MENU_ITEMS: 'menu_items',
  ORDERS: 'orders',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  SALES_DATA: 'sales_data',
  ANALYTICS: 'analytics',
};

// Adding type definition for WebSQL openDatabase
interface WebSQLDatabase {
  transaction(callback: (tx: any) => void, errorCallback?: (error: any) => void, successCallback?: () => void): void;
}

interface WindowWithWebSQL extends Window {
  openDatabase?: (name: string, version: string, displayName: string, estimatedSize: number) => WebSQLDatabase;
}

// SQLite database instance
let sqliteDB: WebSQLDatabase | null = null;

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

// Initialize SQLite database
export const initSQLiteDB = async (): Promise<void> => {
  try {
    // Check if SQLite is available (WebSQL)
    const windowWithSQL = window as WindowWithWebSQL;
    
    if (typeof windowWithSQL.openDatabase === 'function') {
      sqliteDB = windowWithSQL.openDatabase(
        SQLITE_DB_NAME,
        '1.0',
        'Legendary Baos & Wings Restaurant Database',
        2 * 1024 * 1024 // 2MB
      );
      
      // Create tables
      await createSQLiteTables();
      console.log('SQLite database initialized successfully');
    } else {
      console.warn('SQLite (WebSQL) is not supported in this browser, falling back to IndexedDB');
    }
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    throw error;
  }
};

// Create necessary tables in SQLite
const createSQLiteTables = async (): Promise<void> => {
  if (!sqliteDB) return;

  return new Promise((resolve, reject) => {
    sqliteDB.transaction((tx: any) => {
      // Menu Items Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          name TEXT NOT NULL,
          price REAL,
          price_small REAL,
          price_medium REAL,
          price_large REAL,
          description TEXT,
          is_veg INTEGER NOT NULL
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating menu_items table:', error);
          return true;
        }
      );

      // Orders Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT,
          table_number TEXT NOT NULL,
          subtotal REAL NOT NULL,
          tax REAL NOT NULL,
          total REAL NOT NULL,
          timestamp TEXT NOT NULL,
          status TEXT NOT NULL,
          waiter_name TEXT
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating orders table:', error);
          return true;
        }
      );

      // Order Items Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          menu_item_id INTEGER NOT NULL,
          menu_item_name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          size TEXT,
          unit_price REAL NOT NULL,
          total_price REAL NOT NULL,
          notes TEXT,
          FOREIGN KEY(order_id) REFERENCES orders(id)
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating order_items table:', error);
          return true;
        }
      );

      // Profile Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS profile (
          id TEXT PRIMARY KEY,
          restaurant_name TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT,
          gst TEXT,
          logo TEXT,
          tagline TEXT
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating profile table:', error);
          return true;
        }
      );

      // Settings Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS settings (
          id TEXT PRIMARY KEY,
          tax_rate REAL NOT NULL,
          printer_name TEXT,
          receipt_header TEXT,
          receipt_footer TEXT
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating settings table:', error);
          return true;
        }
      );

      // Sales Data Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sales_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          month INTEGER NOT NULL,
          year INTEGER NOT NULL,
          total_sales REAL NOT NULL,
          total_orders INTEGER NOT NULL,
          most_sold_item TEXT,
          most_sold_quantity INTEGER
        )`,
        [],
        () => {},
        (_, error: any) => {
          console.error('Error creating sales_data table:', error);
          return true;
        }
      );

    }, (error: any) => {
      console.error('Transaction error:', error);
      reject(error);
    }, () => {
      console.log('All tables created successfully');
      resolve();
    });
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
  // Try SQLite first if available, then fall back to IndexedDB
  if (sqliteDB && storeName === STORES.ORDERS) {
    try {
      const orders = await getAllOrdersFromSQLite();
      return orders as unknown as T[];
    } catch (error) {
      console.warn('Error getting orders from SQLite, falling back to IndexedDB:', error);
      // Fall back to IndexedDB
    }
  }

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

// SQLite specific operations
const getAllOrdersFromSQLite = (): Promise<any[]> => {
  if (!sqliteDB) {
    return Promise.reject(new Error('SQLite database not initialized'));
  }

  return new Promise((resolve, reject) => {
    sqliteDB.transaction((tx: any) => {
      tx.executeSql(
        `SELECT * FROM orders ORDER BY timestamp DESC`,
        [],
        (_, results: any) => {
          const orders = [];
          for (let i = 0; i < results.rows.length; i++) {
            const order = results.rows.item(i);
            orders.push({
              id: order.id,
              orderNumber: order.order_number,
              tableNumber: order.table_number,
              subtotal: order.subtotal,
              tax: order.tax,
              total: order.total,
              timestamp: new Date(order.timestamp),
              status: order.status,
              waiterName: order.waiter_name,
              items: [] // We'll populate this in a separate query
            });
          }
          
          // We need to fetch items for each order
          const fetchItemsPromises = orders.map((order) => {
            return new Promise((resolveItems, rejectItems) => {
              tx.executeSql(
                `SELECT * FROM order_items WHERE order_id = ?`,
                [order.id],
                (_, itemResults: any) => {
                  const items = [];
                  for (let j = 0; j < itemResults.rows.length; j++) {
                    const item = itemResults.rows.item(j);
                    items.push({
                      id: item.id,
                      menuItemId: item.menu_item_id,
                      menuItemName: item.menu_item_name,
                      quantity: item.quantity,
                      size: item.size,
                      unitPrice: item.unit_price,
                      totalPrice: item.total_price,
                      notes: item.notes
                    });
                  }
                  order.items = items;
                  resolveItems(order);
                },
                (_, error: any) => {
                  console.error('Error fetching order items:', error);
                  rejectItems(error);
                  return true;
                }
              );
            });
          });
          
          Promise.all(fetchItemsPromises)
            .then(() => resolve(orders))
            .catch(reject);
        },
        (_, error: any) => {
          console.error('Error fetching orders:', error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Fetch analytics data
export const getSalesAnalytics = async (): Promise<any> => {
  try {
    // Get all orders from IndexedDB
    const orders = await getAllItems(STORES.ORDERS);
    
    // Calculate metrics
    const totalSales = orders.reduce((sum, order: any) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Get top-selling items
    const itemCounts: Record<string, { count: number, total: number }> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        if (!itemCounts[item.menuItemName]) {
          itemCounts[item.menuItemName] = { count: 0, total: 0 };
        }
        itemCounts[item.menuItemName].count += item.quantity;
        itemCounts[item.menuItemName].total += item.totalPrice;
      });
    });
    
    // Convert to array and sort by count (highest first)
    const topSellingItems = Object.entries(itemCounts)
      .map(([name, data]) => ({
        name,
        quantity: data.count,
        revenue: data.total
      }))
      .sort((a, b) => b.quantity - a.quantity);
    
    // Calculate sales by day for the last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString(undefined, { weekday: 'short' }),
        fullDate: date,
        sales: 0,
        orders: 0,
      };
    });
    
    // Fill data for the last 7 days
    orders.forEach((order: any) => {
      const orderDate = new Date(order.timestamp);
      // Check if order is from the last 7 days
      const dayIndex = last7Days.findIndex(day => 
        orderDate.getDate() === day.fullDate.getDate() && 
        orderDate.getMonth() === day.fullDate.getMonth() &&
        orderDate.getFullYear() === day.fullDate.getFullYear()
      );
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].sales += order.total;
        last7Days[dayIndex].orders += 1;
      }
    });
    
    const salesByDay = last7Days.map(day => ({
      date: day.date,
      sales: day.sales,
      orders: day.orders,
    }));
    
    // Calculate sales by category
    const categoryTotals: Record<string, number> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        // Determine the category based on the item name (simplified approach)
        let category = "Other";
        if (item.menuItemName.includes("WINGS")) {
          category = "Wings";
        } else if (item.menuItemName.includes("BAO")) {
          category = "Baos";
        } else if (item.menuItemName.includes("FRIES")) {
          category = "Sides";
        } else if (item.menuItemName.includes("COOLER") || item.menuItemName.includes("COKE") || item.menuItemName.includes("WATER")) {
          category = "Beverages";
        }
        
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += item.totalPrice;
      });
    });
    
    const salesByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      topSellingItems: topSellingItems.slice(0, 5), // top 5
      salesByDay,
      salesByCategory,
      // Calculate growth rates (comparing to previous days)
      growth: {
        sales: calculateGrowthRate(salesByDay, 'sales'),
        orders: calculateGrowthRate(salesByDay, 'orders'),
        average: averageOrderValue > 0 ? 
          ((averageOrderValue / (totalSales - averageOrderValue || 1)) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    throw error;
  }
};

// Helper function to calculate growth rate
const calculateGrowthRate = (data: any[], key: string): number => {
  if (!data || data.length < 2) return 0;
  
  // Calculate total for the most recent half of the period
  const midpoint = Math.floor(data.length / 2);
  const recentTotal = data.slice(midpoint).reduce((sum, day) => sum + (day[key] || 0), 0);
  const previousTotal = data.slice(0, midpoint).reduce((sum, day) => sum + (day[key] || 0), 0);
  
  if (previousTotal === 0) return 0;
  
  // Convert to numbers explicitly before arithmetic operation
  return ((Number(recentTotal) - Number(previousTotal)) / Number(previousTotal)) * 100;
};
