import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpyStuffComponent } from './components/spy-stuff.component';

const routes: Routes = [{ path: '', component: SpyStuffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpyStuffRoutingModule { }
