
// Main export file for database functionality

// Export constants
export { STORES } from './constants';

// Export IndexedDB operations
export { 
  initDB,
  addItem,
  getItem,
  getAllItems,
  updateItem,
  deleteItem,
  getItemsByIndex
} from './indexedDB';

// Export SQLite operations
export { 
  initSQLiteDB,
  getAllOrdersFromSQLite
} from './sqliteDB';

// Export analytics operations
export { 
  getSalesAnalytics
} from './analytics';

