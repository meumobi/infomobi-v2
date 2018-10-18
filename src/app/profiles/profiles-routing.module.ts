import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: './pages/profiles-list/profiles-list.module#ProfilesListPageModule'
  },
  {
    path: 'detail:id',
    loadChildren: './pages/profile-detail/profile-detail.module#ProfileDetailPageModule'
  },
  {
    path: 'edit:id',
    loadChildren: './pages/profile-edit/profile-edit.module#ProfileEditPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
