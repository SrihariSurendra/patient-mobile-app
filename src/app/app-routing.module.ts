import { AuthguardGuard } from './authguard.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule), canActivate: [AuthguardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
