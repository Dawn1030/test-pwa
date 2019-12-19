import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushSW {

  requestPermission() {
    navigator.serviceWorker.ready
      .then(reg => {
        if ('Notification' in window) {
          Notification.requestPermission((status) => {
            console.log('Notification permission status:', status);
          });
        }
      }).catch(error => {
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
