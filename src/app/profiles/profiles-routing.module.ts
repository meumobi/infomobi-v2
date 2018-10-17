import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: './pages/profiles-list/profiles-list.module#ProfilesListPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
