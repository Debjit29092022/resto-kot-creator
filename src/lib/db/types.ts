
// Database type definitions

// WebSQL types
export interface WebSQLDatabase {
  transaction(callback: (tx: any) => void, errorCallback?: (error: any) => void, successCallback?: () => void): void;
}

export interface WindowWithWebSQL extends Window {
  openDatabase?: (name: string, version: string, displayName: string, estimatedSize: number) => WebSQLDatabase;
}

