import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Sw } from 'src/app/shared/sw';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {
  isPushFirst = false;
  isPushStopB = false;

  constructor(private swPush: SwPush, private sw: Sw) { }

  ngOnInit() {
    this.sw.requestPermission();
  }

  push() {
    this.isPushFirst = true;
    this.sw.displayNotification();
  }

  pushStopB() {
    this.isPushStopB = true;
    this.sw.displayNotification({
      body: '訊息如圖',
      image: './assets/img/stopLittleB.png'
    });
  }

}
