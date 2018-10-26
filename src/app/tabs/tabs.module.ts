import {
  ProfilesListPageModule,
  ProfileDetailPageModule,
  ProfileEditPageModule,
 } from '@profiles/pages';
 import {
  ItemsListPageModule,
  ItemDetailPageModule,
  ItemEditPageModule,
 } from '@items/pages';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsPage } from './tabs.page';
import { ContactPageModule } from '../contact/contact.module';
import { AboutPageModule } from '../about/about.module';
import { HomePageModule } from '../home/home.module';
import {
  CommentsListPageModule,
  CommentEditPageModule,
} from '@comments/pages';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    AboutPageModule,
    ContactPageModule,
    ProfilesListPageModule,
    ProfileDetailPageModule,
    ProfileEditPageModule,
    CommentsListPageModule,
    CommentEditPageModule,
    ItemsListPageModule,
    ItemDetailPageModule,
    ItemEditPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
