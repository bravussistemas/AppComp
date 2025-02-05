import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DatabaseTable } from './database-table';
import { DatabaseProvider } from './database-provider';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import * as Raven from 'raven-js';

export interface IVersionData {
  table_name: string;
  current_version: number;
}

export interface IMigration {
  query: string;
  params?: any[];
}

@Injectable()
export class DatabaseMigrations extends DatabaseTable {

  running: Subject<any>[] = [];

  runned = [];

  migrations: { [key: string]: IMigration[] } = {};
  storage: any;

  constructor(public override db: DatabaseProvider) {
    super(db, 'database_migrations', `
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       table_name TEXT UNIQUE,
       current_version INTEGER
    `);
  }

  register(table: string, migrations: IMigration[]) {
    this.migrations[table] = migrations;
    this.running[table] = new BehaviorSubject(false);
  }

  updateVersion(data: IVersionData): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.get(['table_name'], [data.table_name]).then(
        (result) => {
          if (!result) {

            this.db.query(
              `INSERT INTO ${this.TABLE_NAME} 
                (table_name, current_version) 
                VALUES 
                (?, ?)`, [data.table_name, data.current_version]
            ).then(() => {
              resolve();
            }).catch((e) => reject(e));
          } else {
            this.db.query(
              `UPDATE ${this.TABLE_NAME} 
                SET current_version = ${data.current_version} 
                WHERE table_name = "${data.table_name}"`
            ).then(() => {
              resolve();
            }).catch((e) => reject(e));
          }
        }
      )
    });
  }

  run(table: string, ignore?: boolean) {
    if (this.runned.indexOf(table) !== -1 && !ignore) {
      console.warn(`Migration of table ${table} already was started!`);
      this.running[table].next(true);
      return;
    }
    this.runned.push(table);

    console.debug(`Running migration of table: ${table} ...`);
    this.db.init().then(() => {
      this.get(['table_name'], [table]).then(
        (result) => {
          let startVersion = 0;
          if (result) {
            startVersion = result.current_version;
          }
          this.runMigration(table, startVersion).then((ended) => {
            if (!ended) {
              console.debug(`Running migration of table: ${table} not finished yet, continue...`);
              this.run(table, true);
            } else {
              console.debug(`Running migration of table: ${table} finished, stop...`);
              this.running[table].next(true);
            }
          }).catch((e) => Raven.captureException(e));
        }).catch((e) => Raven.captureException(e));
    });
  }

  runMigration(table, version): Promise<boolean> {
    console.debug(`Running migration ${version} ...`);
    return new Promise((resolve, reject) => {

      let migrations = this.migrations[table][version];

      if (migrations) {
        this.db.query(migrations.query, migrations.params).then(() => {
          let nextVersion = version + 1;
          this.updateVersion({table_name: table, current_version: nextVersion}).then(() => {
            resolve(false);
          }).catch((e) => {
            this.handleError(e);
            reject(e);
          });
        }).catch((e) => {
          this.handleError(e);
          reject(e);
        });

      } else {
        resolve(true);
      }

    })
  }

}

// import { Injectable } from "@angular/core";
// import { map } from 'rxjs/operators';
// import { DatabaseProvider } from "./database-provider";
// import { BehaviorSubject } from "rxjs/BehaviorSubject";
// import { Subject } from "rxjs/Subject";
// import { SQLiteTransaction } from "@ionic-native/sqlite";
//
// let migrations = [];
//
// @Injectable()
// export class DatabaseMigrations {
//
//   migrations = [];
//   version = 0;
//   storage: any;
//   running: Subject<boolean>;
//
//   constructor(protected db: DatabaseProvider) {
//     this.running = new BehaviorSubject(false);
//
//     // this.migrations[0] = function (transaction) {
//     //   let nextVersion = 1;
//     // };
//     //
//     // //maybe a few weeks later you need another migration...
//     // this.migrations[1] = function (transaction) {
//     //   let nextVersion = 2;
//     //   //same exact process as the first:
//     //   //  1) execute queries to manipulate the db as needed
//     //   //  2) increment user_version
//     //   //  3) kick off the next migration
//     // };
//     this.add('')
//   }
//
//   add(migration, params) {
//     let lastVersion = this.version;
//     this.migrations[lastVersion] = (trans: SQLiteTransaction) => {
//       trans.executeSql('PRAGMA user_version = ' + lastVersion + 1, [], () => {
//         trans.executeSql(migration, params, () => {
//           this.kickOffMigration(lastVersion + 1, trans);
//         }, () => {
//         });
//       }, () => {
//       });
//     };
//     this.version++;
//   }
//
//   register(migrations) {
//     this.migrations = migrations;
//   }
//
//   run() {
//     this.db.storage.transaction((trans) => {
//       trans.executeSql('PRAGMA user_version', (t, res) => {
//         let version = res.rows.item(0).user_version;
//         this.kickOffMigration(version, trans);
//       })
//     })
//   }
//
//   kickOffMigration(version, trans) {
//     if (this.migrations[version] && typeof this.migrations[version] === 'function') {
//       this.running.next(true);
//       this.migrations[version](trans);
//     } else {
//       this.running.next(false);
//     }
//   }
// }
