import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomBlockComponent } from '../bottom-block/bottom-block.component';
import { IndexedDB } from 'src/app/core/sw/IndexedDb';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchOption } from 'src/app/core/interface';

@Component({
  selector: 'app-indexeddb',
  templateUrl: './indexeddb.component.html',
  styleUrls: ['./indexeddb.component.scss']
})
export class IndexeddbComponent implements OnInit {
  form: FormGroup;
  bookkeepingList = [];

  constructor(
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private db: IndexedDB
  ) { }

  ngOnInit() {
    this.buildForm();
    this.readBookkeeping();
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['']
    });
  }

  openBottomBlock(item = null): void {
    this.bottomSheet.open(BottomBlockComponent, { data: item })
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
    const opt: SearchOption = { field: 'name', searchData: this.form.value.name };
    this.db.readBookkeeping([opt]).subscribe(res => {
      console.log(res);
      this.bookkeepingList = res;
    });
  }
}
