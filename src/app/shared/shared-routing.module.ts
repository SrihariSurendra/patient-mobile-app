import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '../can-deactivate.guard';
import { PreOpChecklistComponent } from './pre-op-checklist/pre-op-checklist.component';
import { PatientfolderComponent } from './patientfolder/patientfolder.component';
import { SharedComponent } from './shared.component';
import { PrimaryDoctorChangeComponent } from './primary-doctor-change/primary-doctor-change.component';
import { AlertComponent } from './alert/alert.component';
import { AuthguardGuard } from '../authguard.guard';
import { PatientEformsComponent } from './patient-eforms/patient-eforms.component';


const routes: Routes = [
  {
    path: '', component: SharedComponent, children: [
      { path: 'pre-op-checklist', component: PreOpChecklistComponent, canActivate: [AuthguardGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'patientfolder', component: PatientfolderComponent, canActivate: [AuthguardGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'primarydoctor', component: PrimaryDoctorChangeComponent, canActivate: [AuthguardGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'alert', component: AlertComponent, canActivate: [AuthguardGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'patienteforms', component: PatientEformsComponent, canActivate: [AuthguardGuard], canDeactivate: [CanDeactivateGuard] }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { } 
