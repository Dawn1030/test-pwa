import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IndexedDB } from 'src/app/core/sw/IndexedDb';

@Component({
  selector: 'app-bottom-block',
  templateUrl: './bottom-block.component.html',
  styleUrls: ['./bottom-block.component.scss']
})
export class BottomBlockComponent implements OnInit {
  form: FormGroup;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomBlockComponent>,
    private fb: FormBuilder,
    private db: IndexedDB,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [''],
      amount: ['']
    });
  }

  save(key) {
    if (!key) {
      this.db.addBookkeeping(this.form.value).subscribe(res => {
        if (res) {
          alert('Add successfully');
        } else {
          alert('Add failed');
        }
        this.bottomSheetRef.dismiss(res);
      });
    } else {
      this.db.updateBookkeeping(key, this.form.value).subscribe(res => {
        if (res) {
          alert('Update successfully');
        } else {
          alert('Update failed');
        }
        this.bottomSheetRef.dismiss(res);
      });
    }
  }
}
