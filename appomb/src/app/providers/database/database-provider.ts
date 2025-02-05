import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Utils } from '../../utils/utils';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
} from '@capacitor-community/sqlite';

const DB_NAME: string = '__ohMyBreadDb_v2';
const win: any = window;

@Injectable()
export class DatabaseProvider {
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isNative: boolean;
  private _storage: any;
  private DATABASE_NAME = DB_NAME;

  get storage(): any {
    return this._storage;
  }

  constructor(private platform: Platform) {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    this.isNative = Capacitor.getPlatform() !== 'web';
  }

  async createTable(name: string, schema: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }

    const query = `CREATE TABLE IF NOT EXISTS ${name} (${schema})`;
    try {
      await this.db.execute(query);
      console.log(`Table "${name}" created successfully.`);
    } catch (error) {
      console.error(`Error creating table "${name}":`, error);
      throw error;
    }
  }

  async executeQuery(query: string, values: any[] = []): Promise<any> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }

    try {
      const result = await this.db.run(query, values);
      console.log('Query executed successfully:', result);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    if (this.db && this.isNative) {
      try {
        await this.db.close();
        await this.sqliteConnection.closeConnection(DB_NAME, false);
        console.log('Database connection closed successfully.');
      } catch (error) {
        console.error('Error closing SQLite connection:', error);
        throw error;
      }
    } else {
      console.warn('Destroy operation is not supported in web environments.');
    }
  }

  async init(): Promise<void> {
    await this.platform.ready();

    if (this.isNative) {
      try {
        this.db = await this.sqliteConnection.createConnection(
          DB_NAME,
          false,
          'no-encryption',
          1,
          false
        );

        if (!this.db) {
          throw new Error('Failed to create SQLite connection.');
        }

        await this.db.open();
        console.log(`Database ${DB_NAME} initialized successfully.`);
      } catch (error) {
        console.error('Error initializing SQLite:', error);
        throw error;
      }
    } else {
      console.warn(
        'Capacitor SQLite is not supported in the browser. Use IndexedDB or another fallback for web environments.'
      );
    }
  }

  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const p = this._storage.transaction((tx: any) => {
            tx.executeSql(query, params,
              (tx: any, res: any) => resolve({tx: tx, res: res}),
              (tx: any, err: any) => reject({tx: tx, err: err}));
          },
          (err: any) => reject({err: err}));
        if (!Utils.isNullOrUndefined(p)) {
          p.catch((e) => {
            reject({err: e});
          });
        }
        return p;
      } catch (err) {
        reject({err: err});
      }
    });
  }
}