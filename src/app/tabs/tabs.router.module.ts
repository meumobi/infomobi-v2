import {
  ProfilesListPage,
  ProfileDetailPage,
  ProfileEditPage } from '@profiles/pages';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { AboutPage } from '../about/about.page';
import {
  ItemsListPage,
  ItemDetailPage,
  ItemEditPage } from '@items/pages';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'about',
        outlet: 'about',
        component: AboutPage
      },
      {
        path: 'profiles/details/:id',
        outlet: 'profiles',
        component: ProfileDetailPage
      },
      {
        path: 'profiles/edit/:id',
        outlet: 'profiles',
        component: ProfileEditPage
      },
      {
        path: 'profiles/edit',
        outlet: 'profiles',
        component: ProfileEditPage
      },
      {
        path: 'profiles',
        outlet: 'profiles',
        component: ProfilesListPage
        /**
         * Ionic v4 - Tabs are not Lazy Loading Children #14566
         * https://github.com/ionic-team/ionic/issues/14566
         * */
        // loadChildren: '../profiles/profiles.module#ProfilesModule'
      },
      {
        path: 'items/detail/:id',
        outlet: 'items',
        component: ItemDetailPage
      },
      {
        path: 'items/edit/:id',
        outlet: 'items',
        component: ItemEditPage
      },
      {
        path: 'items/edit',
        outlet: 'items',
        component: ItemEditPage
      },
      {
        path: 'items',
        outlet: 'items',
        component: ItemsListPage
        /**
         * Ionic v4 - Tabs are not Lazy Loading Children #14566
         * https://github.com/ionic-team/ionic/issues/14566
         * */
        // loadChildren: '../items/items.module#ItemsModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
