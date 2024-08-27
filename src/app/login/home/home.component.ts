import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigService } from 'src/app/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  tokenData: any = [];
  billID: string | null = null;
  hospitalID: string | null = null;
  constructor(private config: ConfigService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const normalizedParams = Object.keys(params).reduce((acc, key) => {
        acc[key.toLowerCase()] = params[key];
        return acc;
      }, {} as { [key: string]: string });

      this.billID = normalizedParams['billid'] || null;
      this.hospitalID = normalizedParams['hospitalid'] || null;

      if(!this.billID || !this.hospitalID) {
        this.router.navigate(['home/contact-administrator']);
      }

      this.FetchConsultationOrderTokenumber(this.billID, this.hospitalID);
    });
   
  }

  FetchConsultationOrderTokenumber(billID: any, hospitalID: any) {
    this.config.FetchConsultationOrderTokenumber(billID, hospitalID)
      .subscribe((response: any) => {
        if (response.Code == 200) {
          if(response.FetchConsultationOrderTokenumberDataList.length > 0) {
            this.tokenData = response.FetchConsultationOrderTokenumberDataList[0];
          }
          else {
            this.router.navigate(['home/contact-administrator']);
          }
        }
      },
        (err) => {
        })
  }

  opbillprint() {
    this.config.opbillprint(this.tokenData.BillID, this.hospitalID ? this.hospitalID : "3")
      .subscribe(response => {
        this.handlePdfResponse(response);
      },
        (err) => {
        })
  }

  handlePdfResponse(pdfBlob: Blob) {
    const blobUrl = URL.createObjectURL(pdfBlob);
    this.openPdf(blobUrl);
  }

  openPdf(blobUrl: string) {
    window.open(blobUrl, '_blank', 'location=no');
  }
  
}