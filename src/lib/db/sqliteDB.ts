
import { SQLITE_DB_NAME } from './constants';
import { WebSQLDatabase, WindowWithWebSQL } from './types';

// SQLite database instance
let sqliteDB: WebSQLDatabase | null = null;

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

// SQLite specific operations
export const getAllOrdersFromSQLite = (): Promise<any[]> => {
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

