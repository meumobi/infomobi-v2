import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    MomentModule,
  ],
  exports: [
    MomentModule
  ],
  declarations: []
})
export class CoreModule { }
