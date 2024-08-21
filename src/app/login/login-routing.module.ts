import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AuthguardGuard } from '../authguard.guard';
import { ContactAdministratorComponent } from './contact-administrator/contact-administrator.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'changepassword', component: ChangepasswordComponent, canActivate: [AuthguardGuard] },
  { path: 'contact-administrator', component: ContactAdministratorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
