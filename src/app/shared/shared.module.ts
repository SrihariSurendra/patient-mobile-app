// shared.module.ts
import { NgModule } from '@angular/core';
import { TwoDigitDecimaNumberDirective } from '../two-digit-decima-number.directive';
import { FocusNextDirective } from '../focus-next.directive';
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
import { SafePipe } from '../safe.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SignatureComponent } from './signature/signature.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NumberDirective } from '../numbers-only.directive';
import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OverlayModule } from '@angular/cdk/overlay';
import { GenericCloseComponent } from './generic-close/generic-close.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { TemplateService } from './template.service';

@NgModule({
  declarations: [
    TwoDigitDecimaNumberDirective,
    FocusNextDirective, 
    SafePipe, 
    ConfirmationDialogComponent, 
    SignatureComponent, 
    PaginationComponent, 
    NumberDirective, 
    SharedComponent, 
    GenericCloseComponent,
    ErrorMessageComponent,
  ],
  exports: [
    TwoDigitDecimaNumberDirective, 
    FocusNextDirective,
    SafePipe, 
    SignatureComponent, 
    PaginationComponent, 
    CdkAccordionModule, 
    SharedComponent, 
    NumberDirective, 
    GenericCloseComponent,
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
