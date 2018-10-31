import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ItemDetailPage } from './item-detail.page';
import { CommentsModule } from '@comments/comments.module';
import { CoreModule } from '@core/core.module';

const routes: Routes = [
  {
    path: '',
    component: ItemDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommentsModule,
    IonicModule,
    CoreModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ItemDetailPage]
})
export class ItemDetailPageModule {}
