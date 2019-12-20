import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomBlockComponent } from '../bottom-block/bottom-block.component';
import { IndexedDB } from 'src/app/core/sw/IndexedDb';

@Component({
  selector: 'app-indexeddb',
  templateUrl: './indexeddb.component.html',
  styleUrls: ['./indexeddb.component.scss']
})
export class IndexeddbComponent implements OnInit, AfterViewInit {
  bookkeepingList = [];

  constructor(
    private bottomSheet: MatBottomSheet,
    private db: IndexedDB
  ) { }

  ngOnInit() {
    this.readBookkeeping();
  }

  ngAfterViewInit(): void {
    // this.readBookkeeping();
  }

  openBottomBlock(): void {
    this.bottomSheet.open(BottomBlockComponent)
      .afterDismissed().subscribe(res => {
        if (res) {
          this.readBookkeeping();
        }
      });
  }

  readBookkeeping() {
    this.db.readBookkeeping().subscribe(res => {
      console.log(res);
      this.bookkeepingList = res;
    });
  }
}
