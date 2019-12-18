import { Component, OnInit } from '@angular/core';
import { PushSW } from 'src/app/sw/PushSW';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {
  isPushFirst = false;
  isPushStopB = false;

  constructor(private pushSW: PushSW) { }

  ngOnInit() {
    this.pushSW.requestPermission();
  }

  push() {
    this.isPushFirst = true;
    this.pushSW.displayNotification();
  }

  pushStopB() {
    this.isPushStopB = true;
    this.pushSW.displayNotification({
      body: '訊息如圖',
      image: './assets/img/stopLittleB.png'
    });
  }

}
