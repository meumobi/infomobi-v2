import { CommentsListPage } from './comments-list.page';
import { CommentsModule } from 'app/comments/comments.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';


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
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommentsListPage]
})
export class CommentsListPageModule {}
