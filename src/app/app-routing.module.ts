import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SortComponent } from './sort/sort.component';
import { PlaylistFormComponent } from './playlist-form/playlist-form.component';


const routes: Routes = [
  {
    path: 'sort',
    component: SortComponent,
  },
  {
    path: 'playlistForm',
    component: PlaylistFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
