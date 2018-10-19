import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfileHeadlineComponent } from './components/profile-headline/profile-headline.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ProfilesRoutingModule
  ],
  declarations: [ProfileHeadlineComponent],
  exports: [ProfileHeadlineComponent]
})
export class ProfilesModule { }
