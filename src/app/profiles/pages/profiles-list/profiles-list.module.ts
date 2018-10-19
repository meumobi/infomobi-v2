import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilesListPage } from './profiles-list.page';
import { ProfilesModule } from '@profiles/profiles.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilesListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProfilesModule,
  ],
  declarations: [
    ProfilesListPage,
  ],
})
export class ProfilesListPageModule {}
