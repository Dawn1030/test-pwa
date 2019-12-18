import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Sw {

  requestPermission() {
    navigator.serviceWorker.ready
      .then(reg => {
        // registration worked
        console.log('[Service Worker] Registration succeeded. Scope is ' + reg.scope);
        if ('Notification' in window) {
          console.log('Notification permission default status:', Notification.permission);
          Notification.requestPermission((status) => {
            console.log('Notification permission status:', status);
          });
        }
      }).catch(error => {
        // registration failed
        console.log('[Service Worker] Registration failed with ' + error);
      });
  }

  displayNotification(options = {}) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
        const opt = Object.assign({
          icon: './assets/icons/icon-72x72.png',
          body: '測試發送訊息',
          image: './assets/img/littleK.png'
        }, options);
        reg.showNotification('test', opt);
      });
    }
  }
}
