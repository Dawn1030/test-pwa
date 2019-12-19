import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const OBJ = {
  BOOKKEEPING: 'Bookkeeping',
};

export const TX_MODE = {
  READ: 'readonly',
  READandWRITE: 'readwrite'
};

@Injectable({
  providedIn: 'root'
})
export class IndexedDB {
  private dbName = 'testDB';

  constructor() {
  }

  readBookkeeping(): Observable<Array<any>> {
    return Observable.create((obs) => {
      this.openDB().subscribe(db => {
        const result = [];
        const tx = db.transaction(OBJ.BOOKKEEPING, TX_MODE.READ);
        tx.onerror = () => console.log('[read Bookkeeping - tx] fail');
        const store = tx.objectStore(OBJ.BOOKKEEPING);
        const req = store.openCursor();
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
          console.log('[read Bookkeeping - req] fail');
        };
      });
    });
  }

  addBookkeeping(data): Observable<boolean> {
    return Observable.create((obs) => {
      this.openDB().subscribe(db => {
        const tx = db.transaction(OBJ.BOOKKEEPING, TX_MODE.READandWRITE);
        tx.onerror = () => console.log('[add Bookkeeping - tx] fail');
        const store = tx.objectStore(OBJ.BOOKKEEPING);
        const req = store.add(data);
        req.onsuccess = () => {
          obs.next(true);
          db.close();
          obs.complete();
        };
        req.onerror = (ex) => {
          console.log('[add Bookkeeping - req] fail');
          obs.next(false);
          db.close();
          obs.complete();
        };
      });
    });
  }

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

  createDBSchema(db) {
    const store = db.createObjectStore(OBJ.BOOKKEEPING, { autoIncrement : true });
    // TODO: 排序
    // https://www.w3.org/TR/IndexedDB/#key-generator-concept
    // var titleIndex = store.createIndex("by_title", "title", {unique: true});
  }

}
