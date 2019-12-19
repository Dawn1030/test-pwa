import { Component, OnInit } from '@angular/core';
import { PushSW } from 'src/app/core/sw/PushSW';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {
  constructor(private pushSW: PushSW) { }

  ngOnInit() {
    this.pushSW.requestPermission();
  }

  push() {
    this.pushSW.displayNotification();
  }

}
