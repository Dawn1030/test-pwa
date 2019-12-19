import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { PushComponent } from './push/push.component';
import { IndexeddbComponent } from './indexeddb/indexeddb.component';
import { BottomBlockComponent } from './bottom-block/bottom-block.component';

// TODO: 拆module引用
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const matModuleList = [MatInputModule, MatButtonModule, MatBottomSheetModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [PushComponent, IndexeddbComponent, BottomBlockComponent],
  entryComponents: [
    BottomBlockComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    ...matModuleList
  ]
})
export class TestModule { }
