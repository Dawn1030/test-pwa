# Study of PWA in Angular

---

## 1 參考

- | url
- | -
  **綜合/觀念** | [IT 邦鐵人賽-1](https://ithelp.ithome.com.tw/users/20103808/ironman/1389)
  -| [IT 邦鐵人賽-2](https://ithelp.ithome.com.tw/users/20071512/ironman/1222)
  **service-worker** | [Angular 官方](https://angular.io/guide/service-worker-getting-started)
  -| [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker)
  **app-shell** | [Angular 官方](https://angular.io/guide/app-shell)
  -| [google](https://developers.google.com/web/fundamentals/architecture/app-shell)
  **indexedDB** | [MDN](https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API/Using_IndexedDB)
  -| [W3C](https://www.w3.org/TR/IndexedDB/#key-generator-concept)

## 2 建置專案

- **以下內容部分擷取[Angular 官方](https://angular.io/guide/service-worker-getting-started)**

### 2.1 安裝

- 在專案內運行下列指令

  ```
  ng add @angular/pwa
  ```

  即完成

  1. 新增 `@angular/service-worker` =>
     - 啟用 Service Worker 的建構支援
     - 在`app.module`中 import, register `service-worker`
       ```ts
         @NgModule({
           imports: [
             ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
           ]
         })
       ```
  2. 加入`manifest.webmanifest`
     - 應用程式設定(ex: icon, 應用程式名稱)
  3. 加入`ngsw-config.json`
     - service worker 的配置文件
     - 專案 build 之後根據配置產生`ngsw-worker.js`
  4. 修改`index.html`
     - 新增到`manifest.webmanifest`的連結
     - 設定應用程式的底色
       ```html
       <link rel="manifest" href="manifest.webmanifest" />
       <meta name="theme-color" content="#cde0c9" />
       ```
  5. 加入預設 icon 圖片(可在`manifest.webmanifest`中修改)

- 安裝官網推薦運行套件
  ```
  npm i -g http-server
  ```

### 2.2 運行

- 官網:

  > 由於 ng serve 對 Service Worker 無效，所以必須用一個獨立的 HTTP 伺服器在本地測試你的專案

- 故**建構專案後**再使用官網推薦的套件`http-server`啟動服務
  ```
  ng build --prod
  http-server -p 8080 -c-1 dist/<project-name>
  ```

### 2.3 App Shell

- 加入 app-shell 前必須有`RouterModule`和定義`<router-outlet>`
- 建立 app-shell
  ```
  ng generate app-shell --client-project my-app --universal-project server-app
  ```
- 建立後:
  1. 加入`app-shell component`
  2. 加入`src/app/app.server.module.ts`
     - 控制載入什麼
  3. 加入`src/main.server.ts`
  4. 修改`angular.json`配置
  5. 修改`src/app/app.module.ts`
     - before
       ```ts
         @NgModule({
           imports: [
             BrowserModule
           ]
         })
       ```
     - after
       ```ts
           @NgModule({
             imports: [
               BrowserModule.withServerTransition({ appId: 'serverApp' }),
             ]
           })
       ```
  6. 修改`src/main.ts`
     - before
       ```ts
       platformBrowserDynamic()
         .bootstrapModule(AppModule)
         .catch(err => console.error(err));
       ```
     - after
       ```ts
       document.addEventListener("DOMContentLoaded", () => {
         platformBrowserDynamic()
           .bootstrapModule(AppModule)
           .catch(err => console.error(err));
       });
       ```
- 建構
  ```
  ng run my-app:app-shell
  ```
  - `index.html`會多出 app-shell 內容

### 2.4 通知

- 要求權限
  ```js
  navigator.serviceWorker.ready.then(reg => {
    Notification.requestPermission(status => {
      /* status: permission status */
    });
  });
  ```
- 跳通知
  ```js
  navigator.serviceWorker.getRegistration(reg => {
    const opt = {
      /* 通知設定 */
    };
    reg.showNotification("test", opt);
  });
  ```

### 2.5 IndexedDB

- DB
  ```js
  const req = indexedDB.open("DB_NAME", version);
  req.onsuccess = event => {
    /* req.result, event.target.result為db */
  };
  ```
  - `version`必須為整數
- DB Schema
  ```js
  const req = indexedDB.open("DB_NAME", version);
  req.onupgradeneeded = event => {
    const db = event.target.result;
    const store1 = db.createObjectStore("OBJECT_1", { autoIncrement: true });
    const store2 = db.createObjectStore("OBJECT_2", { keyPath: "FIELD" });
  };
  ```
  - TODO: `createIndex`
- Transaction
  ```ts
  const tx = db.transaction("OBJECT", txMode);
  const store = tx.objectStore("OBJECT");
  tx.onerror = () => console.log(`${str} tx fail`);
  ```
  - `txMode` -> 'readonly' | 'readwrite'

## 3 筆記

### 3.1 PWA

- 使用目的: 改善使用者體驗
- **網頁缺點:**
  - 載入速度 (每次開啟都得載、網速...)
  - 缺少原生 APP 功能 (通知...)
- **網頁優點:**
  - 使用流程較簡單 (不用像 APP 要安裝設定...)
  - 降低開發人力成本 (不同平台)
- **開發紀錄:**
  - 在 mac 曾發生沒有出現下載按鈕的情況

### 3.2 Service Worker

- 只有 localhost 和 https 才能使用

### 3.3 App Shell

- `感知效能 > 實際效能` => 提高使用者體驗
- 顯示核心介面 or loading 畫面 => `感知效能`提高
- google 文件上說的 app shell 比較像是核心介面，讓使用者能用最快的速度開始看到 APP 內容

  > App“shell”是支持用戶界面所需的最小的 HTML、CSS 和 JavaScript，如果離線緩存，可確保在用戶重複訪問時提供即時、可靠的良好性能。這意味着並不是每次用戶訪問時都要從網絡加載 App Shell。 只需要從網絡中加載必要的內容。

  > 對於使用包含大量 JavaScript 的架構的單頁應用來說，App Shell 是一種常用方法。這種方法依賴漸進式緩存 Shell（使用服務工作線程）讓應用運行。接下來，爲使用 JavaScript 的每個頁面加載動態內容。App Shell 非常適合用於在沒有網絡的情況下將一些初始 HTML 快速加載到屏幕上。

- Angular 的做法比較像是 loading 畫面，在 loading 時載入`app.server.module.ts`設定要載入的東西

- **開發紀錄:**
  - 不能使用 import css，包版會失敗

### 3.4 通知

- 必須要求權限
- 可以獨立於網頁去執行 => 只要 js 就能跳通知
- **開發紀錄:**
  - 有圖的通知(圖不同、都在 assets 下)，在`http-server`運行時圖片能正常顯示。
    停止運行時，僅有第一則發送的訊息圖片再發送時會顯示。
  - 在 mac 上沒有跳訊息

### 3.5 IndexedDB

- **開發紀錄:**

  - 每次操作 db 無論成功或失敗都得關閉資料庫 (可能發生未知的情況)
    ```ts
    db.close();
    ```
  - 當網頁應用程式於瀏覽器另一個分頁開啟時變更版本則關閉資料庫(參照 mdn 範例)

    ```ts
    db.onversionchange = () => {
      db.close();
      alert("A new version of this page is ready. Please reload!");
    };
    ```

  - 若已存在同名的 DB，則視 version 是否相同觸發`onupgradeneeded`

### 3.6 Service Worker - SwUpdate

- [Angular 官方文件](https://angular.tw/api/service-worker/SwUpdate)
- 實例:
  ```ts
  export class AppModule {
    constructor(private swUpdate: SwUpdate) {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          window.location.reload();
        });
      }
    }
  }
  ```
