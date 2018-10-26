import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { CommentComponent } from './components/comment/comment.component';
import { IonicModule } from '@ionic/angular';
import { MessageComponent } from './components/types/message/message.component';
import { AnniversariesComponent } from './components/types/anniversaries/anniversaries.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    CommentsRoutingModule
  ],
  declarations: [
    CommentComponent,
    MessageComponent,
    AnniversariesComponent,
  ],
  exports: [
    CommentComponent,
    MessageComponent,
    AnniversariesComponent,
  ],
  entryComponents: [
    MessageComponent,
    AnniversariesComponent,
  ]
})
export class CommentsModule { }
