import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
    private db: IndexedDB
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [''],
      amount: ['']
    });
  }

  save() {
    this.db.addBookkeeping(this.form.value).subscribe(res => {
      if (res) {
        alert('Saved successfully');
      } else {
        alert('Save failed');
      }
      this.bottomSheetRef.dismiss(res);
    });
  }
}
