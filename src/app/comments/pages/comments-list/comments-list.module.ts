import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommentsListPage } from './comments-list.page';
import { CommentsModule } from 'app/comments/comments.module';

const routes: Routes = [
  {
    path: '',
    component: CommentsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommentsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommentsListPage]
})
export class CommentsListPageModule {}
