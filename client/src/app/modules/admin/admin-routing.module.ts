import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashBoard', pathMatch: 'full' },
      {path:"dashBoard",component:AdminNavBarComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
