import { DatabaseProvider } from "./database-provider";
import { DatabaseHelper } from "./database-helper";
import { DatabaseMigrations } from "./database-migrations";
import * as Raven from "raven-js";

interface ISQLiteTable {
  init(): Promise<any>;
}

export class DatabaseTable implements ISQLiteTable {

  get INITIAL_SCHEMA(): string {
    return this._INITIAL_SCHEMA;
  }

  get TABLE_NAME(): string {
    return this._TABLE_NAME;
  }

  private _TABLE_NAME: string;
  private _INITIAL_SCHEMA: string;

  constructor(public db: DatabaseProvider,
              tableName: string,
              initialSchema: string,
              protected migration?: DatabaseMigrations) {
    this._TABLE_NAME = tableName;
    this._INITIAL_SCHEMA = initialSchema;
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.init().then(() => {
        this.db.createTable(this._TABLE_NAME, this._INITIAL_SCHEMA)
          .then(() => {
            if (this.migration) {
              this.migration.init().then(() => {
                this.migration.running[this.TABLE_NAME].subscribe(
                  (finished) => {
                    if (finished) {
                      resolve();
                    }
                  }
                );
                this.migration.run(this.TABLE_NAME);
              })
                .catch((e) => reject(e));
            } else {
              resolve();
            }
          })
          .catch((e) => reject(e));
      });
    })
  }

  get(fields: string[], values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let query = `SELECT *
                  FROM ${this.TABLE_NAME} WHERE ${DatabaseHelper.parseFieldsToQuery(fields)}`;
      this.db.query(query, values)
        .then((data) => {
          if (data.res.rows.length > 0) {
            resolve(data.res.rows.item(0));
          } else {
            resolve(null);
          }
        }).catch((e) => reject(e));
    });
  }

  handleError(error) {
    Raven.captureException(error);
  }

}
