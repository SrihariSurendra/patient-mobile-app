// shared.module.ts
import { NgModule } from '@angular/core';
import { TwoDigitDecimaNumberDirective } from '../two-digit-decima-number.directive';
import { FocusNextDirective } from '../focus-next.directive';
import { OthersResultsComponent } from '../portal/others-results/others-results.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OthersResultsBannerComponent } from '../portal/others-results-banner/others-results-banner.component';
import { SafePipe } from '../safe.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DynamicComponent } from './dynamic-date-picker/dynamic.component';
import { HeaderComponent } from '../ward/header/header.component';
import { PatientQuickInformationComponent } from './patient-quick-information/patient-quick-information.component';
import { SignatureComponent } from './signature/signature.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SuitHeaderComponent } from '../suit/suit-header/suit-header.component';
import { ValidateEmployeeComponent } from './validate-employee/validate-employee.component';
import { SummaryComponent } from '../portal/summary/summary.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PatientQuickWalkthroughInfoComponent } from './patient-quick-walkthrough-info/patient-quick-walkthrough-info.component';
import { NumberDirective } from '../numbers-only.directive';
import { PatientQuickActionsComponent } from './patient-quick-actions/patient-quick-actions.component';
import { PreOpChecklistComponent } from './pre-op-checklist/pre-op-checklist.component';
import { SharedRoutingModule } from './shared-routing.module';
import { PatientfolderComponent } from './patientfolder/patientfolder.component';
import { SharedComponent } from './shared.component';
import { SummaryComponent as WardHeaderSummary } from '../ward//summary/summary.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PrimaryDoctorChangeComponent } from './primary-doctor-change/primary-doctor-change.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PatientAlertsComponent } from './patient-alerts/patient-alerts.component';
import { VteRiskAssessmentComponent } from '../ward/vte-risk-assessment/vte-risk-assessment.component';
import { AlertComponent } from './alert/alert.component';
import { VteSurgicalRiskAssessmentComponent } from '../ward/vte-surgical-risk-assessment/vte-surgical-risk-assessment.component';
import { VteObgAssessmentComponent } from '../ward/vte-obg-assessment/vte-obg-assessment.component';
import { GenericCloseComponent } from './generic-close/generic-close.component';
import { DietCounsellingComponent } from '../ward/diet-counselling/diet-counselling.component';
import { InstructionsToNurseComponent } from '../../app/portal/instructions-to-nurse/instructions-to-nurse.component';
import { BradenScaleComponent } from './braden-scale/braden-scale.component';
import { FallRiskAssessmentComponent } from './fall-risk-assessment/fall-risk-assessment.component';
import { CardiologyAssessmentComponent } from '../portal/cardiology-assessment/cardiology-assessment.component';
import { AnesthesiaAssessmentComponent } from '../portal/anesthesia-assessment/anesthesia-assessment.component'; 
import { MedicalAssessmentComponent } from '../portal/medical-assessment/medical-assessment.component';
import { MedicalAssessmentPediaComponent } from '../portal/medical-assessment-pedia/medical-assessment-pedia.component';
import { MedicalAssessmentObstericComponent } from '../portal/medical-assessment-obsteric/medical-assessment-obsteric.component';
import { StatisticsComponent } from '../reports/statistics/statistics.component';
import { YesNoModalComponent } from './yes-no-modal/yes-no-modal.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { HomeMedicationComponent } from '../ward/home-medication/home-medication.component';
import { QuickMedicationComponent } from '../ward/quick-medication/quick-medication.component';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { AllergyComponent } from './allergy/allergy.component';
import { TimeSelectorComponent } from './time-selector/time-selector.component';
import { ReferralComponent } from './referral/referral.component';
import { PatientEformsComponent } from './patient-eforms/patient-eforms.component';
import { TemplateService } from './template.service';

@NgModule({
  declarations: [
    TwoDigitDecimaNumberDirective,
    FocusNextDirective, 
    OthersResultsComponent, 
    OthersResultsBannerComponent,
    SafePipe, 
    ConfirmationDialogComponent, 
    DynamicComponent, 
    HeaderComponent, 
    PatientQuickInformationComponent, 
    SignatureComponent, 
    PaginationComponent, 
    SuitHeaderComponent, 
    ValidateEmployeeComponent, 
    SummaryComponent,
    PatientQuickWalkthroughInfoComponent, 
    NumberDirective, 
    PatientQuickActionsComponent, 
    PreOpChecklistComponent, 
    PatientfolderComponent, 
    SharedComponent, 
    WardHeaderSummary, 
    PrimaryDoctorChangeComponent, 
    PatientAlertsComponent,
    VteRiskAssessmentComponent,
    AlertComponent,
    VteSurgicalRiskAssessmentComponent,
    VteObgAssessmentComponent,
    GenericCloseComponent,
    DietCounsellingComponent,
    InstructionsToNurseComponent,
    BradenScaleComponent,
    FallRiskAssessmentComponent,
    CardiologyAssessmentComponent,
    AnesthesiaAssessmentComponent,
    MedicalAssessmentComponent,
    MedicalAssessmentPediaComponent,
    MedicalAssessmentObstericComponent,
    StatisticsComponent,
    YesNoModalComponent,
    ErrorMessageComponent,
    HomeMedicationComponent,
    QuickMedicationComponent,
    PatientBannerComponent,
    AllergyComponent,
    TimeSelectorComponent,
    ReferralComponent,
    PatientEformsComponent
  ],
  exports: [
    TwoDigitDecimaNumberDirective, 
    FocusNextDirective,
    OthersResultsComponent, 
    OthersResultsBannerComponent, 
    SafePipe, 
    DynamicComponent,
    HeaderComponent, 
    PatientQuickInformationComponent, 
    SignatureComponent, 
    PaginationComponent, 
    SuitHeaderComponent, 
    ValidateEmployeeComponent, 
    SummaryComponent, 
    CdkAccordionModule, 
    PatientQuickWalkthroughInfoComponent, 
    PatientQuickActionsComponent, 
    PreOpChecklistComponent, 
    SharedComponent, 
    PatientfolderComponent, 
    NumberDirective, 
    WardHeaderSummary,
    VteRiskAssessmentComponent,
    AlertComponent,
    VteSurgicalRiskAssessmentComponent,
    VteObgAssessmentComponent,
    GenericCloseComponent,
    DietCounsellingComponent,
    InstructionsToNurseComponent,
    BradenScaleComponent,
    FallRiskAssessmentComponent,
    CardiologyAssessmentComponent,
    AnesthesiaAssessmentComponent,
    MedicalAssessmentComponent,
    MedicalAssessmentPediaComponent,
    MedicalAssessmentObstericComponent,
    StatisticsComponent,
    HomeMedicationComponent,
    QuickMedicationComponent,
    PatientBannerComponent,
    TimeSelectorComponent
  ],
  providers: [
    MatDatepickerModule, 
    DatePipe,
    TemplateService
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatToolbarModule,
    MatMomentDateModule,
    CdkAccordionModule,
    CarouselModule,
    OverlayModule,
  ]
})
export class SharedModule { }
