import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  declarations: []
})
export class CoreModule { }
