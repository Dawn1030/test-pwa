import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushComponent } from './push/push.component';


const routes: Routes = [
  { path: '', redirectTo: 'push', pathMatch: 'full' },
  { path: 'push', component: PushComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
