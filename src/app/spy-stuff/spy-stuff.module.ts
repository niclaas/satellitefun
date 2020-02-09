import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpyStuffRoutingModule } from './spy-stuff-routing.module';
import { SpyStuffComponent } from './components/spy-stuff.component';


@NgModule({
  declarations: [SpyStuffComponent],
  imports: [
    CommonModule,
    SpyStuffRoutingModule
  ]
})
export class SpyStuffModule { }
