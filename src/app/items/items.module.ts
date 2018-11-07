import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemComponent } from './components/item/item.component';
import { ArticlesComponent } from './components/types/articles/articles.component';
import { PollsComponent } from './components/types/polls/polls.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ItemsRoutingModule
  ],
  declarations: [
    ItemComponent,
    ArticlesComponent,
    PollsComponent
  ],
  exports: [
    ItemComponent,
    ArticlesComponent,
    PollsComponent
  ],
  entryComponents: [
    ArticlesComponent,
    PollsComponent,
  ]
})
export class ItemsModule { }
