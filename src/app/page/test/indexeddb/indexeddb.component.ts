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

  openBottomBlock(item = null): void {
    this.bottomSheet.open(BottomBlockComponent, { data: item})
      .afterDismissed().subscribe(res => {
        if (res) {
          this.readBookkeeping();
        }
      });
  }

  deleteBookkeeping(key) {
    this.db.delBookkeeping(key).subscribe(res => {
      if (res) {
        alert('Delete successfully');
        this.readBookkeeping();
      } else {
        alert('Delete failed');
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
