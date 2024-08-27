import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { locationData } from 'src/assets/config-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BYPASS_LOG } from './headers.interceptor';
import { YesNoModalComponent } from '../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'any'
})
export class ConfigService {
  public devApiUrl = "http://172.18.17.219/DoctorPortalAPI/API/";
  public devApiPrintUrl = "http://172.18.17.219/DoctorPortalAPIII/API/";
  public hijApiUrl = "http://172.18.17.219/DEVAPI/API/";
  baseApiUrl = "https://file.io";//
   public prodApiUrl = "";
  patientDetails: any;
  patientInfo: any;
  hospitalId = locationData.locationId;
  public httpOptionsLexicom = {
    headers: new HttpHeaders ({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "**"  })
  }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + btoa('admin' + ':' + '123456'),
    }),
  };
  langData: any;
  langCode: any;
  code: any = "en";
 

  constructor(private https: HttpClient, private router: Router, private modalService: NgbModal) {
  
  }

  onLogout() {

    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.title = 'Confirmation';
    modalRef.componentInstance.message = 'Are you sure you want to proceed?';
    
    modalRef.result.then((result: any) => {
      if (result) {
        let isLoggedIn = "isLoggedIn";
        localStorage.removeItem(isLoggedIn);
        localStorage.removeItem("doctorDetails");
        localStorage.removeItem("IsHeadNurse");
        localStorage.removeItem("fromLoginToWard");
        localStorage.clear()
        sessionStorage.clear();
        this.router.navigate(['/login'])
      } else {
      }
    }).catch((error: any) => {
    });
  }

  getLangData() {
    this.langData = JSON.parse(localStorage.getItem("langData") || '{}');
    return this.langData;
  }

  FetchConsultationOrderTokenumber(BIllID:string, HospitalID:string) {
    return this.https.get<any>(this.devApiUrl + '/FetchConsultationOrderTokenumber?BIllID='+ BIllID +'&HospitalID='+ HospitalID +'', this.httpOptions);    
  }

  opbillprint(BIllID:string, HospitalID:string) {
    return this.https.get('http://172.18.17.219/rcmahhapi/OPBilling/opbillprint?billId='+ BIllID +'&hospitalId='+ HospitalID +'', { responseType: 'blob' });    
  }
}
