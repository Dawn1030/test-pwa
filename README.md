# Study of PWA in Angular
------

## 1 參考

* [IT邦鐵人賽-1](https://ithelp.ithome.com.tw/users/20103808/ironman/1389)
* [IT邦鐵人賽-2](https://ithelp.ithome.com.tw/users/20071512/ironman/1222)

**service-worker**
* [Angular官方](https://angular.io/guide/service-worker-getting-started)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker)

**app-shell**
* [Angular官方](https://angular.io/guide/app-shell)

**indexedDB**
* [mdn](https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API/Using_IndexedDB)
* [w3c](https://www.w3.org/TR/IndexedDB/#key-generator-concept)

## 2 安裝
```
ng add @angular/pwa
npm i -g http-server
```

## 3 運行PWA
在指令列輸入
```
npm run-script build-prod
npm start
```

## 4 app-shell
1.  顯示核心介面 or loading畫面

2. `感知效能 > 實際效能` => 提高使用者體驗

3. 用這包版沒辦法import css

4. [這篇](https://ithelp.ithome.com.tw/articles/10186865)提供概念
> 後續的載入、PWA 只要重新獲取變動的資料，而不是整個頁面的內容都重新下載，藉由 service worker cache App Shell 針對速度做提升

##### 4.1 實作筆記(過程參照官方即可)
* `app-shell.component` => 核心介面 or loading畫面
* `app.server.module.ts` => 預設 import Module (達到上方第4點效果)

## 5 通知
* 要求權限
``` js
navigator.serviceWorker.ready
  .then(reg => {
    Notification.requestPermission(status => {
      /* status: permission status */
    });
  })
```
* 跳通知
``` js
  navigator.serviceWorker.getRegistration(reg => {
    const opt = { /* 通知設定 */ };
    reg.showNotification('test', opt);
  })
```
* 可以獨立於網頁去執行 => 只要js就能跳通知
* 只有localhost和https才能跳
