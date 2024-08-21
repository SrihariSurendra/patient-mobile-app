import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';
import { PatientAlertsComponent } from './patient-alerts/patient-alerts.component';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public devApiUrl = "http://172.18.17.219/DoctorPortalAPI/API/";
  public hijApiUrl = "http://172.18.17.219/DEVAPI/API/";
  baseApiUrl = "https://file.io";//
  public prodApiUrl = "";
  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  // Construct URL with dynamic parameters
  getApiUrl(baseUrl: string, replacements: any): any {
    baseUrl = baseUrl.replace(/\${\s*\w+\s*}/g, function(url) {
      const key = url.substring(2, url.length - 1).trim()
      return (replacements[key] != undefined && (typeof replacements[key] === 'string' || typeof replacements[key] === 'number' || typeof replacements[key] === null))
      ? replacements[key] : url;
    });

    return baseUrl;
  }

  constructor(private https: HttpClient, private modalService: NgbModal) { 
  }

  post(url: any, payload:any) {
    return this.https.post<any>(this.devApiUrl + url , payload);
  }

  postbill(url: any, payload:any) {
    return this.https.post<any>(url , payload);
  }

  savecashissuebill(url: any, payload:any) {
    return this.https.post<any>(url , payload);
  }

  get(url: any) {
    return this.https.get<any>(this.devApiUrl + url);
  }

  getMultipleData(apiList: string[]): Observable<any[]> {
    const observables: Observable<any>[] = [];
    
    apiList.forEach(api => {
      const observable = this.https.get(this.devApiUrl + api);
      observables.push(observable);
    });

    return forkJoin(observables);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  // getPatientAlert(PatientID: any) {
  //   const options: NgbModalOptions = {
  //     backdrop: false
  //   };
  //   const modalRef = this.modalService.open(PatientAlertsComponent, options);
  //   modalRef.componentInstance.PatientID = PatientID;
  //   modalRef.componentInstance.dataChanged.subscribe((data: string) => {
  //     modalRef.close();
  //   });
  // }

  disabledElement(divElementRef: HTMLElement) {
    const elements: NodeListOf<Element> = divElementRef.querySelectorAll('input, textarea, select, div, button');
    elements.forEach((element: Element) => {
      const typedElement = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLDivElement | HTMLButtonElement;
      if (typedElement instanceof HTMLInputElement ||
          typedElement instanceof HTMLTextAreaElement ||
          typedElement instanceof HTMLSelectElement ||
          typedElement instanceof HTMLButtonElement) {
        typedElement.disabled = true;
        typedElement.classList.add('disabled'); 
      }
    });
  }
}
