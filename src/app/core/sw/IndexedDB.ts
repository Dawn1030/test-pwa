import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const enum OBJ {
  BOOKKEEPING = 'Bookkeeping'
}

export const enum TX_MODE {
  READ = 'readonly',
  READandWRITE = 'readwrite'
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDB {
  private dbName = 'testDB';

  constructor() {
  }

  readBookkeeping(): Observable<Array<any>> {
    return this.handle(OBJ.BOOKKEEPING, TX_MODE.READ, (obs, db, store) => {
      const resultList = [];
      const req = store.openCursor();
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resultList.push({ key: cursor.key, ...cursor.value });
          cursor.continue();
        } else {
          obs.next(resultList);
          db.close();
          obs.complete();
        }
      };
      return req;
    });
  }

  addBookkeeping(data): Observable<boolean> {
    return this.handle(OBJ.BOOKKEEPING, TX_MODE.READandWRITE, (obs, db, store) => {
      const req = store.add(data);
      req.onsuccess = () => {
        obs.next(true);
        db.close();
        obs.complete();
      };
      return req;
    });
  }

  delBookkeeping(key): Observable<boolean> {
    return this.handle(OBJ.BOOKKEEPING, TX_MODE.READandWRITE, (obs, db, store) => {
      let req = store.get(key);
      req.onsuccess = (evt) => {
        const record = evt.target.result;
        if (!record) {
          obs.next(false);
          db.close();
          obs.complete();
          console.log(`[${OBJ.BOOKKEEPING}-key: ${key}] no data`);
        }
        req = store.delete(key);
        req.onsuccess = () => {
          obs.next(true);
          db.close();
          obs.complete();
        };
      };
      return req;
    });
  }

  handle(obj: OBJ, txMode: TX_MODE, func: CallableFunction) {
    const str = `[obj: ${obj}]`;
    return Observable.create((obs) => {
      this.openDB().subscribe(db => {
        const tx = db.transaction(obj, txMode);
        const store = tx.objectStore(obj);
        const req = func(obs, db, store);
        req.onerror = () => {
          obs.next(false);
          db.close();
          obs.complete();
          console.log(`${str} req fail`);
        };
        tx.onerror = () => console.log(`${str} tx fail`);
      });
    });
  }

  /** 開啟資料庫
   * 若未建立則建立
   */
  private openDB() {
    return Observable.create((obs) => {
      const req = indexedDB.open(this.dbName, environment.version);
      req.onsuccess = () => {
        obs.next(req.result);
        this.useDatabase(req.result);
        obs.complete();
      };
      req.onerror = () => {
        console.log('open db fail');
      };
      req.onupgradeneeded = () => this.createDBSchema(req.result);
    });
  }

  /** 建立資料庫結構 */
  private createDBSchema(db) {
    const store = db.createObjectStore(OBJ.BOOKKEEPING, { autoIncrement: true });
    // TODO: 排序
    // https://www.w3.org/TR/IndexedDB/#key-generator-concept
    // var titleIndex = store.createIndex("by_title", "title", {unique: true});
    this.useDatabase(db);
  }

  /** 當網頁應用程式於瀏覽器另一個分頁開啟時變更版本則關閉資料庫
   * (參照mdn範例)
   */
  private useDatabase(db) {
    db.onversionchange = () => {
      db.close();
      alert('A new version of this page is ready. Please reload!');
    };
  }

}
