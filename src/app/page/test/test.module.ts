import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { PushComponent } from './push/push.component';

import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [PushComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    MatButtonModule
  ]
})
export class TestModule { }
