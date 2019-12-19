import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushComponent } from './push/push.component';
import { IndexeddbComponent } from './indexeddb/indexeddb.component';


const routes: Routes = [
  { path: '', redirectTo: 'push', pathMatch: 'full' },
  { path: 'push', component: PushComponent },
  { path: 'indexeddb', component: IndexeddbComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
