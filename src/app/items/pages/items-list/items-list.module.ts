import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ItemsListPage } from './items-list.page';
import { ItemsModule } from '@items/items.module';

const routes: Routes = [
  {
    path: '',
    component: ItemsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ItemsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ItemsListPage]
})
export class ItemsListPageModule {}
