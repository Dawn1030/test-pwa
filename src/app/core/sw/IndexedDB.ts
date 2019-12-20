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

export enum MODIFY_MODE {
  ADD = 'Add',
  DELETE = 'Delete'
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDB {
  private dbName = 'testDB';

  constructor() {
  }

  readBookkeeping(): Observable<Array<any>> {
    return this.getAllHandle(OBJ.BOOKKEEPING);
  }

  addBookkeeping(data): Observable<boolean> {
    return this.modifyHandle(OBJ.BOOKKEEPING, MODIFY_MODE.ADD, data);
  }

  /** 編輯obj資料共用處理 */
  modifyHandle(obj: OBJ, modifyMode: MODIFY_MODE, data) {
    return Observable.create((obs) => {
      this.openDB().subscribe(db => {
        const tx = db.transaction(obj, TX_MODE.READandWRITE);
        const store = tx.objectStore(obj);
        let req;
        if (modifyMode === MODIFY_MODE.ADD) {
          req = store.add(data);
        }
        req.onsuccess = () => {
          obs.next(true);
          db.close();
          obs.complete();
        };
        req.onerror = (ex) => {
          console.log(`[${obj} - req] ${modifyMode} fail`);
          obs.next(false);
          db.close();
          obs.complete();
        };
        tx.onerror = () => console.log(`[${obj} - tx] ${modifyMode} fail`);
      });
    });
  }

  /** 取得obj全部資料處裡
   * 因為 [event.target.result] 資料是指標，故特例處理
   */
  getAllHandle(obj: OBJ) {
    return Observable.create((obs) => {
      this.openDB().subscribe(db => {
        const result = [];
        const tx = db.transaction(obj, TX_MODE.READ);
        const req = tx.objectStore(obj).openCursor();
        req.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            obs.next(result);
            db.close();
            obs.complete();
          }
        };
        req.onerror = () => {
          db.close();
          console.log(`[${obj} - req] get all fail`);
        };
        tx.onerror = () => console.log(`[${obj} - tx] get all fail`);
      });
    });
  }

  /** 開啟資料庫
   * 若未建立則建立
   */
  openDB() {
    return Observable.create((obs) => {
      const req = indexedDB.open(this.dbName, environment.version);
      req.onsuccess = () => {
        obs.next(req.result);
        obs.complete();
      };
      req.onerror = () => {
        console.log('open db fail');
      };
      req.onupgradeneeded = () => this.createDBSchema(req.result);
    });
  }

  /** 建立資料庫結構 */
  createDBSchema(db) {
    const store = db.createObjectStore(OBJ.BOOKKEEPING, { autoIncrement : true });
    // TODO: 排序
    // https://www.w3.org/TR/IndexedDB/#key-generator-concept
    // var titleIndex = store.createIndex("by_title", "title", {unique: true});
  }

}
