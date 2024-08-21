import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigService } from 'src/app/services/config.service';

declare var $: any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd-MMM-yyyy HH:mm:ss',
  },
  display: {
    dateInput: 'DD-MMM-yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'dd-MMM-yyyy',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class HomeComponent implements OnInit {
  FetchConsultationOrderTokenumberDataList: any;
  constructor(private config: ConfigService) {

  }

  ngOnInit(): void {
    this.FetchConsultationOrderTokenumber("W76-01", "3");
  }

  FetchConsultationOrderTokenumber(token: any, hospitalID: any) {
    this.config.FetchConsultationOrderTokenumber(token, hospitalID)
      .subscribe((response: any) => {
        if (response.Code == 200) {
          this.FetchConsultationOrderTokenumberDataList = response.FetchConsultationOrderTokenumberDataList;
          console.log(this.FetchConsultationOrderTokenumberDataList);
        }
      },
        (err) => {
        })
  }
  
}