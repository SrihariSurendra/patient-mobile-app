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
  private triggerSubject = new BehaviorSubject<boolean>(false);
  trigger$ = this.triggerSubject.asObservable();

  private triggerSubjectPrint = new BehaviorSubject<boolean>(false);
  triggerPrint$ = this.triggerSubjectPrint.asObservable();
  // public defaultLangCode = new BehaviorSubject("en");

  private triggerDynamicUpdateSubject = new BehaviorSubject<boolean>(false);
  triggerDynamicUpdate$ = this.triggerDynamicUpdateSubject.asObservable();

  private triggerSavePrescriptionSubject = new BehaviorSubject<string>('0');
  triggerSavePrescription$ = this.triggerSavePrescriptionSubject.asObservable();

  private triggerFetchAnesthesiaPrescriptionSubject = new BehaviorSubject<any>('0');
  triggerFetchAnesthesiaPrescription$ = this.triggerFetchAnesthesiaPrescriptionSubject.asObservable();

  private triggerSaveDiagnosisSubject = new BehaviorSubject<any>('');
  triggerSaveDiagnosis$ = this.triggerSaveDiagnosisSubject.asObservable();

  constructor(private https: HttpClient, private router: Router, private modalService: NgbModal) {
    this.patientInfo = JSON.parse(localStorage.getItem("patientInfo") || '{}');
    this.patientDetails = JSON.parse(localStorage.getItem("PatientDetails") || '{}');
    this.langCode = localStorage.getItem('lang');
  }

  trigger(value: boolean) {
    this.triggerSubject.next(value);
  }
  triggerPrint(value: boolean) {
    this.triggerSubjectPrint.next(value);
  }

  triggerDynamicUpdate(value: boolean) {
    this.triggerDynamicUpdateSubject.next(value);
  }

  triggerSavePrescription(value: string) {
    this.triggerSavePrescriptionSubject.next(value);
  }

  triggerFetchAnesthsiaPrescription(value: any) {
    this.triggerFetchAnesthesiaPrescriptionSubject.next(value);
  }

  triggerSaveDiagnosis(value: any) {
    this.triggerSaveDiagnosisSubject.next(value);
  }
 
  getLangData() {
    this.langData = JSON.parse(localStorage.getItem("langData") || '{}');
    return this.langData;
  }
  getLangCode() {
    this.langData = localStorage.getItem('lang');
    return this.langData;
  }
  getSelectedLang(lang: any) {
    return this.https.get(`assets/lang/${lang}.json`)
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
  
   fetchFetchHospitalLocations() {
    return this.https.get<any>(this.devApiUrl + '/FetchHospitalLocations?type=0&filter=blocked=0&UserId=0&WorkstationId=0', this.httpOptions);
  }

  validateDoctorLogin(username: string, password: string, location: string) {
    return this.https.get<any>(this.devApiUrl + '/ValidateLoginCredentials?username='+ username +'&password='+ password +'&location='+ location +'', this.httpOptions);
  }
  // validateDoctorLoginHH(username: string, password: string, location: string) {
  //   return this.https.get<any>(this.devApiUrl + '/ValidateLoginCredentialsHH?username='+ username +'&password='+ password +'&location='+ location +'', this.httpOptions);
  // }
  validateDoctorLoginHH(username: string, password: string, _intTrialCount:number, location: string) {
    return this.https.get<any>(this.devApiUrl + '/ValidateLoginCredentialsHHH?username='+ username +'&password='+ password +'&_intTrialCount=' + _intTrialCount + '&location='+ location +'', this.httpOptions);
  }

  fetchDoctorAppointments(doctorID: string, hospitalId: string, fromDate: any, toDate: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchDoctorAppointments?DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'&FromDate='+ fromDate +'&ToDate='+ toDate+'', this.httpOptions);
  }

  fetchPatients(doctorID: string, hospitalId: string, fromDate: any, toDate: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientDetails?FromDate='+ fromDate +'&ToDate='+ toDate +'&DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'', this.httpOptions);
  }
  fetchPatientAllergies(PatientID: string, RegCode: string, hospitalId: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientAllergies?PatientID='+ PatientID +'&RegCode='+ RegCode +'&HospitalID='+ hospitalId +'', this.httpOptions);
  }
  CancelAppointment(payload: any) {
    return this.https.post<any>(this.devApiUrl + 'CancelAppointment', payload);
  }
  fetchVitalParamsValues(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientvitalsDataDocPat?PatientID='+PatientID+ '&FromDate='+FromDate+ '&ToDate='+ToDate+'&HospitalID='+HospitalID,this.httpOptions);
  }
  fetchPatientVisits(Patientid: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientVisits?Patientid='+ Patientid +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchPatientFileData(EpisodeID: any, Admissionid: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientFileData?EpisodeID='+ EpisodeID +'&Admissionid='+ Admissionid +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchPatientMedication(PatientType: string, IPID: any, PatientID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientOrderedOrPrescribedDrugs?PatientType=' + PatientType + '&IPID='+ IPID +'&PatientID='+ PatientID +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  FetchHospitalNurse(APIName: any, EmpNo: any, UserId: any, WorkStationID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + APIName + '?min=1&max=15&empno=' + EmpNo + '&UserId=' + UserId + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }

  fetchPatientIDByHospId(regcode: any, hospId: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientIDLocation?RegCode='+ regcode +'&HospitalID='+hospId, this.httpOptions);
  }

  fetchOutPatientData(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVitalsByPatientId?PatientID='+ PatientID +'&TBL=1&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchOutPatientDataRR(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVitalsByPatientIdRR?PatientID='+ PatientID +'&TBL=3&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  fetchInPatientData(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    var tbl = "1,2"
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVitalsByPatientIdIP?PatientID='+ PatientID +'&TBL='+tbl+'&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchIPPatientVitals(IPID:any, FromDate:any, ToDate:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchIPPatientVitals?IPID='+ IPID +'&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  FetchIPPatientVitalsRR(IPID:any, FromDate:any, ToDate:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchIPPatientVitalsRR?IPID='+ IPID +'&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchPatientVitalsByIPID(IPID:any, FromDate:any, ToDate:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVitalsByIPID?IPID='+ IPID +'&TBL=1&FromDate='+ FromDate +'&ToDate='+ ToDate +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  getLabTestOrders(reqPayload: any) {
    return this.https.post<any>(this.devApiUrl + 'TestOrders', reqPayload);
  }

  getOutsideLabTestOrders(PatientID: any, IsRadiology: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientOutsideMedicalReport?PatientID='+PatientID+ '&IsRadiology='+IsRadiology,this.httpOptions);
  }

  getLabReportResults() {
    let reqPayload = {
      "RegCode": this.patientDetails.RegCode,
      "HospitalId": this.hospitalId,
      "TestOrderItemId": "2690582",
      "TestOrderId": "841123"
    }
    return this.https.post<any>(this.devApiUrl + 'LabReport', reqPayload);
  }

  getLabReportPdf(reqPayload: any) {
    return this.https.post<any>(this.devApiUrl + 'LabReportGroupPDF', reqPayload);
  }

  fetchPatientLabTestOrders(PatientID: any, Min: any, Max: any, IsResult: any, location: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientLabOrders?PatientID='+PatientID+ '&Min='+Min+ '&Max='+Max+ '&IsResult='+IsResult+'&HospitalID='+location,this.httpOptions);
  }

  getTestOrderDetails(reqPayload: any) {
    //this.patientDetails.RegCode,
    return this.https.post<any>(this.devApiUrl + 'TestOrderDetails', reqPayload);
  }
  getPatientDetails(payload: any) {
    //"ALHH.0000343014"
    return this.https.post<any>(this.devApiUrl + 'PatientSelection', payload);
  }
  fetchMedicationDemographics(demographic: any, UserId: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchMedicationDemographics?demographic='+ demographic + '&UserId=' + UserId + '&HospitalID='+ HospitalID,this.httpOptions);
  }
  fetchDrugFrequencies(UserId: any, WorkStationID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchDrugFrequencies?Tbl=2&LanguageID=0&UserId=' + UserId + '&WorkStationID=' + WorkStationID + '&HospitalID='+ HospitalID,this.httpOptions);
  }
  fetchMedicationInstructions(UserId: any, Filter:any, WorkStationID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdminMasters?Type=813&Filter=' + Filter + '&USERID=' + UserId + '&WORKSTATIONID=' + WorkStationID + '&HospitalID='+ HospitalID,this.httpOptions);
  }
  fetchItemDetails(min:any, max: any, Type:any, Filter:any, UserId: any, WorkStationID: any, HospitalID: any, DoctorID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchItemDetails?min='+ min +'&max='+ max +'&Type='+ Type +'&Filter=' + Filter + '&UserId=' + UserId + '&WorkStationID=' + WorkStationID + '&HospitalID='+ HospitalID + '&DoctorID='+DoctorID,this.httpOptions);
  }
  fetchItemDetailsGB(Filter:any, WorkStationID: any, HospitalID: any, DoctorID:any,IsGenericItem:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchItemDetailsN?Filter=' + Filter + '&WorkStationID=' + WorkStationID + '&HospitalID='+ HospitalID + '&DoctorID='+DoctorID+ '&IsGenericItem='+IsGenericItem,this.httpOptions);
  }
  fetchItemForPrescriptions(PatientType: string, ItemId:any, TBL:any, UserId: any, WorkStationId: any, HospitalID: any, DoctorID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchItemForPrescriptions?PatientType=' + PatientType + '&ItemID='+ ItemId +'&TBL=' + TBL + '&UserId=' + UserId + '&WorkStationId=' + WorkStationId + '&HospitalID='+ HospitalID +'&DoctorID='+DoctorID,this.httpOptions);
  }
  FetchPrescriptionValidations(AdmissionID:any, ItemID:any, intGenericid: any, ItemName: any, PatientID: any, Age: any, DoctorID:any, SpecialiseID:any, HospitalID:any,PatientType:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPresValidations?AdmissionID=' +AdmissionID + '&ItemID=' + ItemID + '&intGenericid='+ intGenericid +'&ItemName=' + ItemName + '&PatientID= '+PatientID+'&Age=' + Age +'&DoctorID=' + DoctorID +'&SpecialiseID=' + SpecialiseID +'&HospitalID='+HospitalID+'&PatientType='+PatientType,this.httpOptions);
  }
  displayScheduleAndQuantity(UserId: any, WorkStationID: any, FreqVal: any, CurrentIndx: any, DosageUnit: any, DurationUnit: any, DurationVal: any, Type: any, IssueTypeUOM: any, ItemId: any, DefaultUOMID: any, PrescStartDate: any, PatientType:any, dischargeChk:any) {
    return this.https.get<any>(this.devApiUrl + 'DisplayScheduleAndQuantity?FeqId=' + FreqVal + '&DosageUnit=' + DosageUnit + '&DurationUnit=' + DurationUnit + '&DurationVal=' + DurationVal  + '&Type=' + Type  + '&IssueType=' + IssueTypeUOM  + '&ItemId=' + ItemId  + '&DefaultUnitID=' + DefaultUOMID + '&StartDate='+ PrescStartDate+ '&PatientType=' + PatientType + '&dischargeChk='+dischargeChk,this.httpOptions);
  }
  getInvestigationProcedureDetails(Name: any, Param1: any, DoctorID:any) { 
    //"ALHH.0000343014"  this.devApiUrl + '    
    return this.https.get<any>(this.devApiUrl + 'FetchInvestigationProcedureDetailsH?Name='+ Name +'&Param1='+ Param1 + '&DoctorID=' +DoctorID);
  }
  getInvestigationProcedureDetailsN(Name: any, Param1: any, DoctorID:any) { 
    //"ALHH.0000343014"  this.devApiUrl + '    
    return this.https.get<any>(this.devApiUrl + 'FetchInvestigationProcedureDetailsHN?Name='+ Name +'&Param1='+ Param1 + '&DoctorID=' +DoctorID);
  }
  getProcedureDetailsN(Name: any, ServiceID: any, HospitalID:any, DoctorID:any) { 
    //"ALHH.0000343014"  this.devApiUrl + '    
    return this.https.get<any>(this.devApiUrl + 'FetchInvestigationProcedureDetailsHNN?Name='+ Name +'&ServiceID='+ ServiceID + '&HospitalID=' + HospitalID + '&DoctorID=' +DoctorID);
  }
  FetchServiceActionableAlerts(Admissionid: any, Age: any, ItemID: any) { 
    //"ALHH.0000343014"  this.devApiUrl + '    
    return this.https.get<any>(this.devApiUrl + 'FetchServiceActionableAlerts?Admissionid='+ Admissionid +'&Age='+ Age+ '&ItemID='+ItemID);
  }
  CheckValidPrescribedItems(PatientID:any,Admissionid:any, ServiceID:any,Serviceitemid:any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'CheckValidPrescribedItems?PatientID=' + PatientID + '&Admissionid=' + Admissionid +'&ServiceID=' + ServiceID +'&Serviceitemid=' + Serviceitemid +'&WorkStationID=' + WorkStationID +'&HospitalID=' +HospitalID);
  }
  saveAllPrescription(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `SavePrescriptions`, postdata, this.httpOptions);
  }
  PBMIntegrationCall(payload: any) {
    return this.https.post<any>(this.devApiUrl + `PBMIntegrationCall`, payload, this.httpOptions);
  }
  saveAdmissionReconPrescriptions(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `SaveAdmissionReconPrescriptions`, postdata, this.httpOptions);
  }

  getFetchFavouriteitemsDoctorWise(PatientType: string, doctorID: any) { 
    //"ALHH.0000343014"  this.devApiUrl + '    
    return this.https.post<any>(this.devApiUrl + 'FetchFavouriteitemsDoctorWise?PatientType=' + PatientType +'&DoctorID='+ doctorID +'', this.httpOptions);
  }
  getPreviousMedication(PatientID:any, fromdate:any, todate:any, UserId:any, workstationId:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientPrescribedDrugsHistory?PatientID='+ PatientID +'&Fromdate='+ fromdate + '&ToDate='+todate+'&UserId='+ UserId +'&workstationId='+workstationId);
  }
  fetchFavDoctorDiagnosis(DoctorID:any) {
    return this.https.post<any>(this.devApiUrl + 'FetchFavDoctorDiagnosis?DoctorID=' + DoctorID ,this.httpOptions);
  } 
  saveDiagnosis(payload:any){
    return this.https.post(this.devApiUrl + 'SaveDiagnosis' , payload ,this.httpOptions);

  }
  SaveClinicalConditionsNew(payload:any) {
    return this.https.post<any>(this.devApiUrl + `SaveClinicalConditionsNew`, payload, this.httpOptions);
  }
  saveDiagnosisAftersave(Admissionid:any){
    return this.https.post<any>(this.devApiUrl + 'FetchDiagnosisAfterSave?Admissionid='+ Admissionid , this.httpOptions);

  }
  fetchDiagnosisSmartSearch(filter:any, DoctorID: any){
    return this.https.post<any>(this.devApiUrl + 'FetchDiagnosisSmartSearch?Filter='+  filter +'&DoctorID=' + DoctorID , this.httpOptions);

  }
  /**
   * 
    @description this function for privew Paitent click on diagonsis Tab
   */
  getPrivewsPainent(episodeId=0,VisitID:any= 0,MonitorID:any=0, DoctorID:any) {    
    return this.https.post(this.devApiUrl + 'FetchPrevVisitDiagnosis?'+ 'EpisodeID=' + episodeId + '&VisitID=' + VisitID + '&MonitorID=' + MonitorID + '&DoctorID='+ DoctorID,this.httpOptions);
  }
  SaveDiagnosisSelected(data:any){
    return this.https.post(this.devApiUrl + 'SaveDiagnosis',data, this.httpOptions);
  }
  afterSaveDiagnosis(Admsid:any){
    return  this.https.post(this.devApiUrl + 'FetchDiagnosisAfterSave?' + 'Admissionid=' + Admsid,this.httpOptions)
  }
  searchDiagnosis(Filter:any){
    return this.https.post(this.devApiUrl +'FetchDiagnosisSmartSearch?' + 'Filter='+ Filter, this.httpOptions)
  }
  FetchPackagePrescriptionOrderPacks(DiseaseIDs:any, Tbl:any, UserId:any, workstationId:any,OrderPack:any,OrderPackIDs:any, Admissionid:any, HospitalId:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPackagePrescriptionOrderPacks?DiseaseIDs='+ DiseaseIDs +'&Tbl='+ Tbl + '&UserId='+ UserId +'&workstationId='+workstationId + '&OrderPack='+OrderPack+'&OrderPackIDs='+OrderPackIDs+'&Admissionid='+Admissionid+'&HospitalId='+HospitalId);

  }
  
  FetchMasterDiseases(Filter:any, type: any, DoctorID: any){
    var filterString = 'Filter=' + Filter +'&Type='+type;
    return this.https.post(this.devApiUrl +'FetchMasterDiseases?'+ filterString+ '&DoctorID=' +DoctorID, this.httpOptions)
  }
  FetchOrderPackJustification(admissionId:any) {
    return this.https.post<any>(this.devApiUrl + 'FetchOrderPackJustification?AdmissionID='+admissionId, this.httpOptions);
  }
  savePatientOrderPackRejected(payload:any) {
    return this.https.post<any>(this.devApiUrl + `SavePatientOrderPackRejected`, payload, this.httpOptions);
  }
  savePatientItemLevelOrderPackRejected(payload:any) {
    return this.https.post<any>(this.devApiUrl + `SavePatientItemLevelOrderPackRejected`, payload, this.httpOptions);
  }
  fetchPainScoreMasters(){
    return this.https.post<any>(this.devApiUrl + 'FetchPainScoreMasters', this.httpOptions);
  }
  fetchClinicalConditions(){
    return this.https.post<any>(this.devApiUrl + 'FetchClinicalConditions', this.httpOptions);

  }
    getPatientHight(PatientID:any){
    return this.https.post(this.devApiUrl + 'FetchPatientHeightWeight?' + 'PatientID=' + PatientID , this.httpOptions)
  }

  FetchPatientFileInfo(episodeId:any, visitId:any, HospitalID:any, PatientID:any, RegCode:any) {
    return this.https.post(this.devApiUrl + 'FetchPatientFileInfo?' + 'episodeId=' + episodeId + '&visitId=' +visitId +'&HospitalID=' +HospitalID+'&PatientID='+PatientID+'&UHID='+RegCode , this.httpOptions)
  }
  FetchPatientAdmissionClinicalDetails(PatientId:any,Admissionid:any,HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchPatientAdmissionClinicalDetails?' + 'PatientId=' + PatientId + '&Admissionid=' +Admissionid +'&HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchPrescriptionInfo(PatientType: string, episodeId:any,visitId:any,PatientID:any,HospitalID:any, DoctorID:any,ChkDischargeCheck:any) {
    return this.https.post(this.devApiUrl + 'FetchPrescriptionInfo?' + 'PatientType=' + PatientType +'&episodeId=' + episodeId + '&visitId=' +visitId +'&PatientID=' + PatientID + '&HospitalID=' +HospitalID+'&DoctorID='+DoctorID+'&ChkDischargeCheck='+ChkDischargeCheck , this.httpOptions);
  }
  FetchPrescriptionInfoAnesthesia(PatientType: string, episodeId:any,visitId:any,PatientID:any,HospitalID:any, DoctorID:any,ChkDischargeCheck:any, AnestheisiaID:any) {
    return this.https.post(this.devApiUrl + 'FetchPrescriptionInfo?' + 'PatientType=' + PatientType +'&episodeId=' + episodeId + '&visitId=' +visitId +'&PatientID=' + PatientID + '&HospitalID=' +HospitalID+'&DoctorID='+DoctorID+'&ChkDischargeCheck='+ChkDischargeCheck + '&AnestheisiaID=' + AnestheisiaID, this.httpOptions);
  }
  fetchPregenencyHistoryADV(PatientID:any, AdmissionID:any){
    return this.https.post(this.devApiUrl + 'FetchPregenencyHistoryADV?' + 'PatientID=' + PatientID+'&AdmissionID='+AdmissionID , this.httpOptions)
  }
  savePregenencyHistory(payload:any){
    return this.https.post(this.devApiUrl + 'savePregenencyHistory',payload  , this.httpOptions)
  }
  saveClinicalConditions(payload:any){
    return this.https.post<any>(this.devApiUrl + `SaveClinicalConditions`, payload, this.httpOptions);
  }
  getVitalsParams(HospitalID: any, GenderID: any, Age: any) {
    return this.https.post<any>(this.devApiUrl + 'GetVitalsParams?HospitalID='+HospitalID+ '&GenderID='+GenderID+'&Age='+Age, this.httpOptions);
  }
  getVitalsParamsSpec(HospitalID: any, SpecialisationID: any, WorkStationID: any, GenderID: any, Age: any, AgeUOMID: any, ConsciousnessTypeID: any, BehaviorTypeID: any) {
    return this.https.get<any>(this.devApiUrl + `GetVitalsParamsSpec?SpecialisationID=${SpecialisationID}&GenderID=${GenderID}&Age=${Age}&AgeUOMID=${AgeUOMID}&ConsciousnessTypeID=${ConsciousnessTypeID}&BehaviorTypeID=${BehaviorTypeID}&WorkStationID=${WorkStationID}&HospitalID=${HospitalID}`, this.httpOptions);
  }
  getConciousnessAndBehavior(HospitalID: any, WorkStationID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchConsciousnessAndBehaviorTypes?HospitalID='+HospitalID+ '&WorkStationID='+ WorkStationID, this.httpOptions);
  }
  fetchVitalHypertensionParameters(HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchHypertensionParameters?HospitalID='+HospitalID, this.httpOptions);
  }
  FetchVisitDiagnosis(admissionId:any) {
    return this.https.post<any>(this.devApiUrl + 'FetchVisitDiagnosis?AdmissionID='+admissionId, this.httpOptions);
  }

  fetchDrugSmartSearch(filter:any){
    return this.https.post<any>(this.devApiUrl + 'FetchDrugAllergies?DisplayName='+  filter , this.httpOptions);

  }
  FetchInstructionsToNurse(Prefix:any,UserID:any,WorkStationID:any,HospitalID:string) {
    return this.https.get<any>(this.devApiUrl + 'FetchInstructionsToNurse?Prefix='+ Prefix +'&UserID='+ UserID +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  FetchPatientNursingInstructions(PatientId:any,IPID:any,UserID:any,WorkStationID:any,HospitalID:string) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientNursingInstructions?PatientId='+ PatientId +'&IPID=' + IPID + '&UserID='+ UserID +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchFoodSmartSearch(filter:any){
    return this.https.post<any>(this.devApiUrl + 'FetchFoodAllergies?DisplayName='+  filter , this.httpOptions);

  }

  SaveAllergies(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SavePatientAllergies?DisplayName' , payload , this.httpOptions);

  }
  SavePatientNursingInstructions(payload: any) {
    return this.https.post<any>(this.devApiUrl + `SavePatientNursingInstructions`, payload, this.httpOptions);
  }
  SaveNursingInstructionsAck(payload: any) {
    return this.https.post<any>(this.devApiUrl + `SaveNursingInstructionsAck`, payload, this.httpOptions);
  }
  SaveClinicalVitals(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveClinicalVitals' , payload , this.httpOptions);
  }
  SaveClinicalIPVitals(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveClinicalIPVitals' , payload , this.httpOptions);
  }
  UpdatePatientEpisodeclose(AdmissionID:any, ISEpisodeclose:any, DoctorID:any, EpisodeRemarks:any) {
    return this.https.post<any>(this.devApiUrl + 'UpdatePatientEpisodeclose?AdmissionID='+AdmissionID+ '&ISEpisodeclose='+ISEpisodeclose+'&DoctorID='+DoctorID+ '&EpisodeRemarks=' +EpisodeRemarks, this.httpOptions);
  }
  saveFavouriteProcedure(payload: any) {
    return this.https.post<any>(this.devApiUrl + `SaveDoctorFavourite`, payload, this.httpOptions);
  }
  fetchSavedClinicalCondition(Admissionid:any, PatientID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchClinicalInfo?Admissionid='+  Admissionid + '&PatientID='+PatientID , this.httpOptions);
    // return this.https.get<any>(this.devApiUrl + 'FetchClinicalInfo?Admissionid=2269047&PatientID=2074523' , this.httpOptions);
  }

  FetchPainscoreHistory(AdmissionId: string, FromDate: any, ToDate: any, UserID:string, WorkstationID:string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchPainscoreHistory?AdmissionId=' + AdmissionId + '&FromDate='+ FromDate +'&ToDate='+ ToDate +'&UserID='+ UserID +'&WorkstationID=' + WorkstationID + '&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchDoctorInPatients(DoctorID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchDoctorInPatients?DoctorID='+  DoctorID + '&HospitalID='+HospitalID , this.httpOptions);
  }

  fetchIPOPPatientCount(doctorID: string, hospitalId: string, fromDate: any, toDate: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchIPOPPatientCount?FromDate='+ fromDate +'&ToDate='+ toDate +'&DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchCaseSheetConfigurations(doctorID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchCaseSheetConfigurations?DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  fetchPatientVisitsforSickLeave(PatientID:any, PatientType: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSickLeavePatientVisits?PatientID='+ PatientID +'&PatientType='+ PatientType, this.httpOptions);
  }
  fetchPrimaryDoctor(HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPrimaryDoctor?HospitalID='+ HospitalID, this.httpOptions);
  }

  fetchAdviceDiagnosis(Admissionid: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdviceDiagnosis?TBL=1&Admissionid='+ Admissionid +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchDietTypesOld() {
    return this.https.get<any>(this.devApiUrl + 'FetchDietTypes?Type=112&DisplayName=%%%' , this.httpOptions);
  }
  fetchDietTypes(UserID:string, WorkstationID:string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchDietTypeH?UserID='+ UserID +'&WorkStationID='+ WorkstationID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  FetchAdmissionTypeH(UserID:string, WorkstationID:string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdmissionTypeH?UserID='+ UserID +'&WorkStationID='+ WorkstationID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchAdminMasters(type: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdminMasters?Type='+ type +'&Filter=blocked=0' , this.httpOptions);
  }

  saveAdvice(payload: any) {
    return this.https.post<any>(this.devApiUrl + 'SaveAdvice', payload);
  }

  fetchAdviceData(Admissionid: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdviceData?TBL=1&Admissionid='+ Admissionid +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  fetchTypeofPrecautions(){
    return this.https.get<any>(this.devApiUrl + 'FetchTypeofPrecautions', this.httpOptions);
  }
  fetchPatientPrecautions(Admissionid:any){
    return this.https.get<any>(this.devApiUrl + 'FetchPatientPrecautions?AdmissionID=' + Admissionid ,this.httpOptions)
  }
  savePatientPrecautions(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SavePatientPrecautions' , payload ,this.httpOptions);
  }
  saveSickLeave(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `SaveSickLeave`, postdata, this.httpOptions);
  }
  fetchPatientSickLeave(AdmissionID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientSickLeave?AdmissionID=' + AdmissionID ,this.httpOptions)
  }
  cancelSickLeave(SickleaveID:any, DoctorID:any) {
    return this.https.post<any>(this.devApiUrl + 'CancelSickLeave?SickleaveID='+ SickleaveID +'&DoctorID='+ DoctorID +'' , this.httpOptions);
  }
  FetchPatientSickLeaveSMS(AdmissionID:any, ReportType:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientSickLeaveSMS?AdmissionID='+ AdmissionID +'&ReportType='+ ReportType +'&HospitalID='+HospitalID , this.httpOptions);
  }

  fetchPriority() {
    return this.https.get<any>(this.devApiUrl + 'FetchPriority' , this.httpOptions);
  }

  fetchDoctorSearch(filter: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchReferalDoctors?Tbl=11&Name=' + filter , this.httpOptions);
  }

  fetchSurgeries(filter: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeries?Filter=' + filter , this.httpOptions);
  }
  fetchSurgeriesH(filter: any,DoctorID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeriesH?Filter=' + filter+'&DoctorID='+ DoctorID , this.httpOptions);
  }

  fetchSurgeryPriority() {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryPriority' , this.httpOptions);
  }

  fetchSurgeryDoctors(doctorID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryDoctors?DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchSurgeryDoctorDept(doctorID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryDoctorDept?DoctorID='+ doctorID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchSurgeryEstTime(hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryEstTime?HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  FetchSurgeryCountingSheetInstruments(hospitalId: string, WorkStationID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryCountingSheetInstruments?HospitalID='+ hospitalId +'&WorkStationID=' + WorkStationID , this.httpOptions);
  } 

  savePatientSurgery(payload: any) {
    return this.https.post<any>(this.devApiUrl + 'SavePatientSurgery', payload);
  }

  fetchSurgeryData(SurgeryRequestID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryData?SurgeryRequestID='+ SurgeryRequestID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  fetchListofSurgies(Admissionid: string, UserID: any, WorkStationID:any, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchListofSurgies?Admissionid='+ Admissionid +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  FetchViewSurgeriesH(Admissionid: string, UserID: any, WorkStationID:any, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchViewSurgeriesH?AdmissionID='+ Admissionid +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchLabVisits(PatientID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchLabVisits?PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchLabOrderResults(fromDate: any, ToDate: any, PatientID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchLabOrderResults?fromDate='+ fromDate +'&ToDate='+ ToDate +'&PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchRadOrderResults(fromDate: any, ToDate: any, PatientID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchRadOrderResults?fromDate='+ fromDate +'&ToDate='+ ToDate +'&PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchCardiologyOrderResults(fromDate: any, ToDate: any, PatientID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchCardOrderResults?fromDate='+ fromDate +'&ToDate='+ ToDate +'&PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchLabReportGroupPDF(RegCode: any, TestOrderId: any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchLabReportGroupPDF?RegCode='+ RegCode +'&TestOrderId='+ TestOrderId +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  radioLogyReportPDF(reqPayload: any) {
    return this.https.post<any>(this.devApiUrl + 'RadioLogyReportPDF', reqPayload);
  }
  fetchRadReportGroupPDF(RegCode: any, TestOrderItemId: any, TestOrderId: any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchRadReportGroupPDF?RegCode='+ RegCode +'&TestOrderItemId='+ TestOrderItemId +'&TestOrderId='+ TestOrderId +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  FetchSubstituteItems(itemID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSubstituteItems?ItemID='+ itemID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  
  fetchInvestigationOrders(HospitalID: string, DoctorID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchInvestigationOrders?HospitalID='+ HospitalID +'&DoctorID='+DoctorID , this.httpOptions);
  }
  fetchRefill(PatientID:any, PatientType:any, EpisodeId:any, MonitorID:any, IPID:any, DoctorID:any, SpecialiseID:any, HospitalID:any,ChkDischargeCheck:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchRefill?PatientID='+ PatientID +'&PatientType='+ PatientType +'&EpisodeId='+ EpisodeId +'&MonitorID='+MonitorID+ '&IPID='+IPID+ '&DoctorID='+DoctorID+ '&SpecialiseID='+SpecialiseID+ '&HospitalID='+HospitalID+ '&ChkDischargeCheck='+ChkDischargeCheck , this.httpOptions); 
  }

  fetchRadiologyRequestSafetyChecklists(SpecialiseID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchRadiologyRequestSafetyChecklists?SpecialiseID='+ SpecialiseID +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  savePatientRadiologyRequestForms(payload: any) {
    return this.https.post<any>(this.devApiUrl + 'SavePatientRadiologyRequestForms', payload);
  }

  fetchPatientRadiologyRequestForms(PrescriptionID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientRadiologyRequestForms?PrescriptionID='+ PrescriptionID +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  fetchMedicalCertificateRequest(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchMedicalCertificateRequest?PatientID='+ PatientID +'&FromDate='+ FromDate  +'&ToDate='+ ToDate  +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  fetchPatientSickLeaveWorkList(PatientID: any, FromDate: any, ToDate: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientSickLeaveWorkList?PatientID='+ PatientID +'&FromDate='+ FromDate  +'&ToDate='+ ToDate  +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  fetchMedicalCertificatePDF(PatientID: any, MedicalCertificationID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchMedicalCertificatePDF?PatientID='+ PatientID +'&MedicalCertificationID='+ MedicalCertificationID  +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }

  fetchPatientSickLeavePDF(AdmissionID: any, SickLeaveID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientSickLeavePDF?AdmissionID='+ AdmissionID +'&SickLeaveID='+ SickLeaveID +'&HospitalID='+ HospitalID  +'', this.httpOptions);
  }
  fetchTeethMasters(HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchTeethMasters?HospitalID='+ HospitalID, this.httpOptions);
  }
  fetchPediaTeethMasters(HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPediaTeethMasters?HospitalID='+ HospitalID, this.httpOptions);
  }
  fetchLabTestGraph(TestName: any, PatientID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchLabTestGraph?TestName='+ TestName +'&PatientID='+ PatientID + '&HospitalID=' +HospitalID);
  }
  saveDentalForm(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `SavePatientTeethInfoDetails`, postdata, this.httpOptions);
  }
  fetchPatientTeethInfoDetails(AdmissionId:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientTeethInfoDetails?AdmissionId=' +AdmissionId + '&HospitalID='+ HospitalID, this.httpOptions);
  }
  fetchPatientPediaTeethInfoDetails(AdmissionId:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientPediaTeethInfoDetails?AdmissionId=' +AdmissionId + '&HospitalID='+ HospitalID, this.httpOptions);
  }

  updatePatientRadiologyRequestForms(PatientRadiologyRequestId:any, PrescriptionID: any, HospitalID: any){
    return this.https.post<any>(this.devApiUrl + 'UpdatePatientRadiologyRequestForms?PatientRadiologyRequestId='+  PatientRadiologyRequestId +'&PrescriptionID=' + PrescriptionID +'&HospitalID=' + HospitalID +'' , this.httpOptions);
  }

  fetchDrugsConsumables(Name: any, HospitalID: any ) {
    return this.https.get<any>(this.devApiUrl + 'FetchDrugsConsumables?Name='+ Name +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchSurgeryEquipments(Name: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryEquipments?Name='+ Name +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchSurgeryBloodComponents(HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgeryBloodComponents?HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchAdvPatientAllergies(PatientID: any,RegCode: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdvPatientAllergies?PatientID='+ PatientID +'&RegCode='+ RegCode +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  
  fetchAdverseFormsMasters(HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdverseFormsMasters?HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchAdvPatientActiveMedication(PatientID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdvPatientActiveMedication?PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchUsersGroups(UserID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchUsersGroups?UserID='+ UserID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchAdvPatientVaccination(PatientID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdvPatientVaccination?PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  saveAdverseEvents(payload:any) {
    return this.https.post<any>(this.devApiUrl + `SavePatientAdverseForms`, payload, this.httpOptions);
  }
  fetchSavedAdverseEvents(AdmissionID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientAllAdverseEvents?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchLabDocReportGroupPDF(TestOrderId: any,TestOrderItemId: any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchLabDocuments?TestOrderID='+ TestOrderId +'&TestOrderItemID='+ TestOrderItemId +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchDocPanicCountResults(FromDate:any, ToDate:any, DoctorID:any, Tbl: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchDocPanicCountResults?FromDate='+ FromDate +'&ToDate='+ ToDate +'&DoctorID=' + DoctorID + '&Tbl=' + Tbl +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchPrimaryDoctorReviewPatienClinicalTemplate(FromDate:any, ToDate:any, DoctorID:any, WorkStationID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPrimaryDoctorReviewPatienClinicalTemplate?FromDate='+ FromDate +'&ToDate='+ ToDate +'&PrimaryDoctorID=' + DoctorID + '&WorkStationID=' + WorkStationID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  updateIsdocReadRemarks(payload:any) {
    return this.https.post<any>(this.devApiUrl + `UpdateIsdocReadRemarks`, payload, this.httpOptions);
  }
  fetchRODNurses(Filter:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchRODNurses?Filter='+ Filter +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchDoctor(Filter:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchDoctorName?Filter='+ Filter +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchSpecialisationDoctors(Filter: any, SpecialisationID: any, DoctorID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSpecialisationDoctors?Filter='+ Filter +'&SpecialisationID='+ SpecialisationID +'&DoctorID='+ DoctorID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  FetchSpecialisationDoctorsNP(Filter: any, SpecialisationID: any, DoctorID: any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSpecialisationDoctorsNP?Filter='+ Filter +'&SpecialisationID='+ SpecialisationID +'&DoctorID='+ DoctorID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  blockPrescriptionItems(payload:any) {
    return this.https.post<any>(this.devApiUrl + `BlockPrescriptionItems`, payload, this.httpOptions);
  }
  fetchConsulSpecialisation(HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchConsulSpecialisation?HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchMedicationHold(DoctorID:any, HospitalID: any) {
    return this.https.get<any>(this.devApiUrl + 'FetchMedicationHold?Demographic=824&UserId=' + DoctorID + '&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  holdPrescriptionItems(payload:any) {
    return this.https.post<any>(this.devApiUrl + `holdPrescriptionItems`, payload, this.httpOptions);
  }
  fetchVitalScoreonVital(VitalID:any, Value:any, UserId:any, HospitalId:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchVitalScoreonVital?VitalID='+ VitalID +'&Value='+ Value +'&UserId='+ UserId +'&HospitalID='+ HospitalId +'' , this.httpOptions);
  }
  fetchVitalPainScoreMaster(HospitalId:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchVitalPainScore?HospitalID='+ HospitalId, this.httpOptions);
  }
  fetchVitalScores(UserId: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchVitalScores?UserId='+ UserId + '&HospitalID=' + HospitalID, this.httpOptions);
  }
  fetchListOfPrescription(AdmissionID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchListOfPrescription?AdmissionID='+ AdmissionID + '&HospitalID=' + HospitalID, this.httpOptions);
  }
  FetchPrescriptionInfoIP(PrescID: string,MonitorID: string,PatientType: string, episodeId:any,visitId:any,PatientID:any,HospitalID:any, DoctorID:any,ChkDischargeCheck:any) {
    return this.https.post(this.devApiUrl + 'FetchPrescriptionInfoIP?' + 'PrescID=' + PrescID +'&MonitorID=' + MonitorID +'&PatientType=' + PatientType +'&episodeId=' + episodeId + '&visitId=' +visitId +'&PatientID=' + PatientID + '&HospitalID=' +HospitalID+'&DoctorID='+DoctorID+'&ChkDischargeCheck='+ChkDischargeCheck , this.httpOptions);
  }
  fetchSavedAdmissionReconciliation(PatientType:any, IPID:any, PatientID:any,NoPreviousMedication:any, hdnAdmCheck:any,HospitalID:any,ChkDischargeCheck:any) {
    return this.https.get(this.devApiUrl + 'FetchAdmissionRecDrugs?' + 'PatientType=' + PatientType +'&IPID=' + IPID +'&PatientID=' + PatientID +'&NoPreviousMedication=' + NoPreviousMedication + '&hdnAdmCheck=' +hdnAdmCheck +'&HospitalID=' + HospitalID+'&ChkDischargeCheck=' + ChkDischargeCheck, this.httpOptions);
  }
  LoadPatientVisitsADM(PatientID:any,IPID:any, PatientType:any, WorkStationID:any, HospitalID:any) {
    return this.https.get(this.devApiUrl + 'LoadPatientVisitsADM?' + 'PatientID=' + PatientID +'&IPID=' + IPID +'&PatientType=' + PatientType +'&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID, this.httpOptions);
  }
  fetchAdmissionRecoStatus(HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdmissionRecoStatus?HospitalID='+ HospitalID,this.httpOptions);
  }
  fetchSavedDischargeReconciliation(PatientType:any, IPID:any, PatientID:any,NoPreviousMedication:any, hdnAdmCheck:any,HospitalID:any,ChkDischargeCheck:any) {
    return this.https.get(this.devApiUrl + 'FetchDischargeRecDrugs?' + 'PatientType=' + PatientType +'&IPID=' + IPID +'&PatientID=' + PatientID +'&NoPreviousMedication=' + NoPreviousMedication + '&hdnAdmCheck=' +hdnAdmCheck +'&HospitalID=' + HospitalID+'&ChkDischargeCheck=' + ChkDischargeCheck, this.httpOptions);
  }
  fetchAssessmentSelected(EpisodeID:any, Admissionid:any, PatientTemplateid:any, HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchAssessmentSelected?' + 'EpisodeID=' + EpisodeID +'&Admissionid=' + Admissionid +'&PatientTemplateid=' + PatientTemplateid +'&HospitalID=' + HospitalID, this.httpOptions);
  }
  fetchCalendarMedicationList(FromDate:any, ToDate:any, IPID:any, HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchCalendarMedicationList?' + 'FromDate=' + FromDate +'&ToDate=' + ToDate +'&IPID=' + IPID +'&HospitalID=' + HospitalID, this.httpOptions);
  }
  FetchDrugAdministrationDrugs(FromDate:any, ToDate:any, IPID:any, HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchDrugAdministrationDrugs?' + 'FromDate=' + FromDate +'&ToDate=' + ToDate +'&IPID=' + IPID +'&HospitalID=' + HospitalID, this.httpOptions);
  }
  fetchDrugAdministrationM(intUserid: any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchDrugAdministrationMaster?UserID=' + intUserid + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  fetchNeurologyOrderResults(fromDate: any, ToDate: any, PatientID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchNeurologyOrderResults?fromDate='+ fromDate +'&ToDate='+ ToDate +'&PatientID='+ PatientID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  
  getLexicomAlerts(payload:any) {
    return this.https.post<any>('http://172.18.17.82/cdi/api/AllAlerts', payload, this.httpOptionsLexicom);
  }

  fetchGrowthChartResults(PatientID: string, Type: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'fetchGrowthChartResults?PatientID='+ PatientID +'&Type='+ Type +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  FetchSpecialisationSurgery(SurgeryID: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSpecialisationSurgery?SurgeryID='+ SurgeryID +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  SavePatientSmokingInfo(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SavePatientSmokingInfo' , payload , this.httpOptions);
  }
  FetchSmokingInfo(PatientID: any, AdmissionID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchSmokingInfo?PatientID='+ PatientID +'&AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  fetchPatientVisitDiagnosis(Admissionid: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdviceDiagnosis?TBL=1&Admissionid='+ Admissionid +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }
  fetchPatientVisitSurgery(Admissionid: string, hospitalId: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdviceSurgery?TBL=4&Admissionid='+ Admissionid +'&HospitalID='+ hospitalId +'' , this.httpOptions);
  }

  fetchVisitLabOrderResults(fromDate: any, ToDate: any, PatientID: string,AdmissionID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchVisitLabOrderResults?fromDate='+ fromDate +'&ToDate='+ ToDate +'&PatientID='+ PatientID +'&AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'' , this.httpOptions);
  }

  fetchSpecialisationClinicalConditions(SpecialisationID: string, hospitalId: string){
    return this.https.get<any>(this.devApiUrl + 'FetchSpecialisationClinicalConditions?SpecialisationID='+ SpecialisationID +'&HospitalID='+ hospitalId +'', this.httpOptions);

  }

  fetchDentalDermaSpecialSpecialisation(hospId:string) {
    return this.https.get<any>(this.devApiUrl + 'FetchDentalDermaSpecialSpecialisation?Type=5&HospitalID='+ hospId +'', this.httpOptions);
  }

  FetchPatientObGDisSummaryTempData(AdmissionID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientObGDisSummaryTempData?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatientObgDischargeSummary(AdmissionID: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientObgDischargeSummary?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  dynamicdata(APIName: any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + APIName + '?HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchEstimatedDeliveryDates(LMP:any, HospitalID:string){
    return this.https.get<any>(this.devApiUrl + 'FetchEstimatedDeliveryDates?' + 'LMP=' + LMP+'&HospitalID='+HospitalID , this.httpOptions);
  }

  SavePatientObGDischargeSummary(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SavePatientObGDischargeSummary' , payload , this.httpOptions);
  }
  FetchPatientObgDischargeSummaryPrint(AdmissionID:string, HospitalID:string){
    return this.https.get<any>(this.devApiUrl + 'FetchPatientObgDischargeSummaryPrint?' + 'AdmissionID=' + AdmissionID+'&HospitalID='+HospitalID , this.httpOptions);
  }
  FetchEmergencyDischargeDispositions(UserId: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchEmergencyDischargeDispositions?UserId='+ UserId + '&WorkStationID=' + "0"+ '&HospitalID=' + HospitalID, this.httpOptions);
  }
  UpdateEMRPatientEpisodeclose(PatientID:any,AdmissionID:any, ISEpisodeclose:any, DoctorID:any,SpecialiseID:any,BillID:any, EpisodeRemarks:any,DispositionID:any,ExpiredDate:any,TriageLOS:any,HospitalID:any, PrimaryDocID:any, PrimarySpecialiseID:any, WardID:any) {
    return this.https.post<any>(this.devApiUrl + 'UpdateEMRPatientEpisodeclose?PatientID='+PatientID+ '&AdmissionID='+AdmissionID+ '&ISEpisodeclose='+ISEpisodeclose+'&DoctorID='+DoctorID+'&SpecialiseID='+SpecialiseID+'&BillID='+BillID+ '&EpisodeRemarks=' +EpisodeRemarks+ '&DispositionID=' +DispositionID+ '&ExpiredDate=' +ExpiredDate+ '&TriageLOS=' +TriageLOS+ '&HospitalID=' +HospitalID + '&PrimaryDocID=' + PrimaryDocID + '&PrimarySpecialiseID=' + PrimarySpecialiseID + '&WardID=' + WardID, this.httpOptions);
  }
  FetchCasesheetModeOfarrival(UserId:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchModeOfarrival?UserId='+ UserId +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchApprovalRequestAdv(VisitID:any, UserId:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchApprovalRequestAdv?VisitID=' + VisitID + '&UserId='+ UserId +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  SavePatientChiefComplaint(payload:any){
    return this.https.post<any>(this.devApiUrl + `SavePatientChiefComplaint`, payload, this.httpOptions);
  }
  FetchPatientChiefComplaintAndExaminations(Admissionid:any,UserId:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientChiefComplaintAndExaminations?Admissionid='+ Admissionid +'&UserId='+ UserId +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  GetFrequencyScheduleTime(Frqen:any,CustomValue:any,Dose:any,Durationval:any,DurationUomval:any,UserId:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/GetFrequencyScheduleTime?Frqen='+ Frqen +'&CustomValue='+ CustomValue +'&Dose=' + Dose +'&Durationval='+ Durationval + '&DurationUomval=' + DurationUomval + 'UserId='+ UserId + '&WorkStationID=' + "0"+ '&HospitalID=' + HospitalID +'', this.httpOptions);
  }
  FetchPulmologyClinicalTemplateDetails(AdmissionID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPulmologyClinicalTemplateDetails?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  SavePatientPulmologyAssessments(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SavePatientPulmologyAssessments' , payload , this.httpOptions);
  }

  FetchPulmologyClinicalTemplateSavedDetails(AdmissionID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatienClinicalTemplateDetails?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatienAdmissionClinicalTemplateDetails(PatientTemplatedetailID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatienAdmissionClinicalTemplateDetails?PatientTemplatedetailID='+ PatientTemplatedetailID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchConsentFormPatientAdmissionDetails(AdmissionID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchConsentFormPatientAdmissionDetails?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchEmployeeSignaturesBase64(EmpID:any,UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchEmployeeSignaturesBase64?EmpID='+ EmpID +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatientRelatives(HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientRelatives?HospitalID='+ HospitalID +'', this.httpOptions);
  }

  SaveConsentForHighRiskOperations(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveConsentForHighRiskOperations' , payload , this.httpOptions);
  }
  
  SavePatientGeneralConsent(payload:any) {
    return this.https.post<any>(this.devApiUrl + 'SavePatientGeneralConsent' , payload , this.httpOptions);
  }
  FetchPatientadmissionGeneralConsent(AdmissionID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientadmissionGeneralConsent?AdmissionID=' + AdmissionID + ' +&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchPatientGeneralConsent(ConsentHighRiskOperationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientGeneralConsent?GeneralConsentID=' + ConsentHighRiskOperationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatientadmissionAgaintConsentForHighRiskOperations(AdmissionID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientadmissionAgaintConsentForHighRiskOperations?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatientConsentForHighRiskOperations(ConsentHighRiskOperationID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientConsentForHighRiskOperations?ConsentHighRiskOperationID='+ ConsentHighRiskOperationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchEmployeeInfo(EmpID: any,UserID:any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchEmployeeInfo?EmpID='+ EmpID +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchDoctorNotifications(DoctorID:any, FromDate:any, ToDate:any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchDoctorNotifications?DoctorID='+ DoctorID +'&FromDate=' + FromDate + '&ToDate=' + ToDate + '&WorkStationID=' + WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  SaveEmployeeSignatures(payload:any) {
    return this.https.post<any>(this.devApiUrl + 'SaveEmployeeSignatures' , payload , this.httpOptions);
  }

  SavePatientMedicalInformedConsent(payload:any) {
    return this.https.post<any>(this.devApiUrl + 'SavePatientMedicalInformedConsent' , payload , this.httpOptions);
  }

  FetchPatientAdmissionMedicalInformedConsent(AdmissionID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientAdmissionMedicalInformedConsent?AdmissionID='+ AdmissionID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchPatientMedicalInformedConsent(MedicalInformedConsentID: any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientMedicalInformedConsent?MedicalInformedConsentID='+ MedicalInformedConsentID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchPatientGeneralConsentPrint(ConsentHighRiskOperationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchPatientGeneralConsentPrint?GeneralConsentID=' + ConsentHighRiskOperationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchItemStickerPrint(PatientID:any,PrescriptionID:any,WardID:any,UserID:any,UserName:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchItemStickerPrint?PatientID=' + PatientID+ '&PrescriptionID='+ PrescriptionID+ '&WardID='+ WardID+ '&UserID='+ UserID+ '&UserName='+ UserName+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchItemStickerPresPrint(AdmissionID:any,PatientID:any,PrescriptionID:any,WardID:any,UserID:any,UserName:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchItemStickerPresPrint?AdmissionID=' + AdmissionID+ '&PatientID=' + PatientID+ '&PrescriptionID='+ PrescriptionID+ '&WardID='+ WardID+ '&UserID='+ UserID+ '&UserName='+ UserName+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }

  FetchIndPreviousPresc(PrescriptionID:any,IPID:any,UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchIndPreviousPresc?PrescriptionID='+ PrescriptionID+ '&IPID='+ IPID+ '&UserID='+ UserID+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchIndMedicationHistory(PatientID:any,IPID:any,UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchIndMedicationHistory?PatientID=' + PatientID+ '&IPID='+ IPID+ '&UserID='+ UserID+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchIndDiscontinueMed(PrescriptionID:any,IPID:any,UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchIndDiscontinueMed?PrescriptionID='+ PrescriptionID+ '&IPID='+ IPID+ '&UserID='+ UserID+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }  

  FetchCMedicationHistory(PatientID:any,PatientType:any,IPID:any, UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchCMedicationHistory?PatientID=' + PatientID + '&PatientType=' + PatientType + '&IPID='+ IPID+ '&UserID='+ UserID+ '&WorkStationID='+ WorkStationID + '&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchERWorkFlow(PatientId:any,Admissionid:any,HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchERWorkFlow?' + 'PatientId=' + PatientId + '&Admissionid=' +Admissionid +'&HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchTransferWards(HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchTransferWards?HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchTransferWardBedType(WardID:any, HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchTransferWardBedType?WardID=' + WardID + '&HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchWardRequestType(HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchWardRequestType?HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchWardPriority(HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchWardPriority?HospitalID=' +HospitalID, this.httpOptions)
  }
  SaveBedTransferRequests(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveBedTransferRequests' , payload , this.httpOptions);
  }
  FetchBedTransferRequests(IPID:any,Type:string, FromDate:any,ToDate:any,HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchBedTransferRequests?IPID=' + IPID + '&Type='  + Type + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchBedDischargeRequests(IPID:any,Type:string, FromDate:any,ToDate:any,HospitalID:any) {
    return this.https.get(this.devApiUrl + 'FetchBedDischargeRequests?IPID=' + IPID + '&Type='  + Type + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&HospitalID=' +HospitalID, this.httpOptions)
  }
  FetchAdmittedChildDetails(MotherPatientId:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdmittedChildDetails?MotherPatientId=' + MotherPatientId + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  SaveMilkBottleBarCodeGeneration(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveMilkBottleBarCodeGeneration' , payload , this.httpOptions);
  }
  FetchPrintBarCodeGener(payload:any){
    return this.https.post<any>(this.devApiUrl + 'FetchPrintBarCodeGener' , payload , this.httpOptions);
  }
  FetchActiveMilkBottlesInfo(MotherPatientId:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchActiveMilkBottlesInfo?MotherPatientId=' + MotherPatientId + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  SaveMilkBottleQty(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveMilkBottleQty' , payload , this.httpOptions);
  }
  FetchPrintBarCodeGenerAfterQty(payload:any){
    return this.https.post<any>(this.devApiUrl + 'FetchPrintBarCodeGenerAfterQty' , payload , this.httpOptions);
  }
  FetchAdmittedMotherDetails(ChildPatientID:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchAdmittedMotherDetails?ChildPatientID=' + ChildPatientID + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchActiveMotherMilkInfo(MotherPatientId:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchActiveMotherMilkInfo?MotherPatientId=' + MotherPatientId + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchMilkBottleQty(MotherMilkExtractionID:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchMilkBottleQty?MotherMilkExtractionID=' + MotherMilkExtractionID + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  SaveMilkFeedingBaby(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveMilkFeedingBaby' , payload , this.httpOptions);
  }
  FetchMilkFeedingSchedules(ChildIPID:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchMilkFeedingSchedules?ChildIPID=' + ChildIPID + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchBabyInfo(SSN:any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchBabyInfo?SSN=' + SSN + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  SaveMilkContinousFeedingBaby(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveMilkContinousFeedingBaby' , payload , this.httpOptions);
  }
  SaveMilkFeedingBabySchedule(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveMilkFeedingBabySchedule' , payload , this.httpOptions);
  }
  ModifyFeedingQuantityInSchedule(payload:any){
    return this.https.post<any>(this.devApiUrl + 'ModifyFeedingQuantityInSchedule' , payload , this.httpOptions);
  }
  FetchBedTransferWardRequests(WardID:any, FromDate: any, ToDate:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchBedTransferWardRequests?WardID=' + WardID + '&FromDate=' + FromDate + '&ToDate=' + ToDate  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchWardsBedTypes(UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchWardsBedTypes?UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchWardsBedTransferAssign(WardID: any, UserID: any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + 'FetchWardsBedTransferAssign?WardID=' + WardID + '&UserID=' + UserID + '&WorkStationID=' + WorkStationID  + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  SaveBedTransferWardAcceptance(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveBedTransferWardAcceptance' , payload , this.httpOptions);
  }
  SaveBedTransferBedAcceptance(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveBedTransferBedAcceptance' , payload , this.httpOptions);
  }
  UpdateIsReadDcotorNotifications(payload:any) {
    return this.https.post<any>(this.devApiUrl + `UpdateIsReadDcotorNotifications`, payload, this.httpOptions);
  }
  FetchEligibleBedTypes(CompanyID:any, GradeID:any, UserID:any,WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchEligibleBedTypes?CompanyID='  + CompanyID + '&GradeID=' + GradeID + '&UserID='+ UserID +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchSurgerRecordsForDashboard(FromDate: any, ToDate: any, SSN: string,FacilityId:any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchSurgerRecordsForDashboard?FromDate='+ FromDate +'&ToDate='+ ToDate +'&SSN='+ SSN +'&tbl=0&FacilityId=' + FacilityId + '&HospitalID='+ HospitalID +'' , this.httpOptions);
  }
  fetchBedsFromWard(WardID: any, ConsultantID: any, Status: any, UserId: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + '/FetchBedsFromWardNP?WardID=' + WardID + '&ConsultantID=' + ConsultantID + '&Status=' + Status + '&UserId=' + UserId + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  fetchBedsFromWardReferal(ConsultantID: any, UserId: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + '/FetchBedsFromWardReferal?ConsultantID=' + ConsultantID + '&UserId=' + UserId + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  fetchBedsFromWardReferalDateWise(ConsultantID: any, FromDate:any, ToDate:any, WardID:any, UserId: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + '/FetchBedsFromWardReferalDateWise?ConsultantID=' + ConsultantID + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&WardID=' + WardID + '&UserId=' + UserId + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchPatientPrescibedDrugHistory(ItemID:any,PatientID:any, WorkStationID:any,HospitalID:any,SSN:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientPrescibedDrugHistory?ItemID=' + ItemID + '&PatientID=' + PatientID + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID + '&SSN=' + SSN + '', this.httpOptions);
  }
  fetchUserFacility(UserId: string, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + '/FetchUserFacility?UserId=' + UserId + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  saveDoctorDefaultWards(payload:any){
    return this.https.post<any>(this.devApiUrl + 'SaveDoctorDefaultWards' , payload , this.httpOptions);
  }
  FetchDoctorDefaultWards(DoctorID:any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchDoctorDefaultWards?DoctorID=' + DoctorID + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
  FetchIPOrdersForOrderStatus(AdmissionID: string, UserID: any, WorkStationID:any, HospitalID: string) {
    return this.https.get<any>(this.devApiUrl + 'FetchIPOrdersForOrderStatus?AdmissionID='+ AdmissionID +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID, this.httpOptions);
  }
  CancelbedTransferRequests(TransReqID: string, UserID: any, WorkStationID:any, HospitalID: string) {
    return this.https.post<any>(this.devApiUrl + 'CancelbedTransferRequests?TransReqID='+ TransReqID +'&UserID=' + UserID + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID, this.httpOptions);
  }
  FetchDrugAdministrationDrugsIPIssues(IPID:any, UserID: any, WorkStationID:any, HospitalID: string) {
    return this.https.get(this.devApiUrl + 'FetchDrugAdministrationDrugsIPIssues?' + 'IPID=' + IPID +'&UserID=' + UserID +'&WorkStationID=' + WorkStationID +'&HospitalID=' + HospitalID, this.httpOptions);
  }
  FetchPatientVitalsWithDiseases(PatientID:any, TBL:any, WorkStationID:any, HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVitalsWithDiseases?PatientID='+ PatientID +'&TBL='+ TBL +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchPatientVisitsAndChiefComplaint(PatientID:any, WorkStationID:any, HospitalID:any) { 
    return this.https.get<any>(this.devApiUrl + '/FetchPatientVisitsAndChiefComplaint?PatientID='+ PatientID +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  }
  FetchPackagePrescriptionOrderPackTrimesters(PatientID:any,Trimester:any, WorkStationID:any, HospitalID:any) {    
     return this.https.get<any>(this.devApiUrl + 'FetchPackagePrescriptionOrderPackTrimesters?PatientID='+ PatientID +'&Trimester='+ Trimester +'&WorkStationID='+WorkStationID + '&HospitalID='+HospitalID);
  }
  FetchAdviceOPDiagnosis(Admissionid:any, HospitalID:any){
    return this.https.get<any>(this.devApiUrl + 'FetchAdviceOPDiagnosis?TBL=5&Admissionid='+ Admissionid + '&HospitalID=' +  HospitalID, this.httpOptions);
  }
  UpdatePatientFitForDischarge(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `UpdatePatientFitForDischarge`, postdata, this.httpOptions);
  }
  SavePregenencyHistoryH(payload:any){
    return this.https.post(this.devApiUrl + 'SavePregenencyHistoryH',payload  , this.httpOptions)
  }
  FetchFraminghamRiskScoreForMenandWomen(PatientID:any, WorkStationID:any, HospitalID:any) { 
    return this.https.get<any>(this.devApiUrl + '/FetchFraminghamRiskScoreForMenandWomenC?PatientID='+ PatientID +'&WorkStationID='+ WorkStationID +'&HospitalID='+ HospitalID +'', this.httpOptions);
  } 
  htmltopdf(template: any, PatientId:any,Admissionid:any,HospitalID:any) {
    return this.https.get(this.devApiPrintUrl + 'htmltopdf?template='+ template +'&PatientId=' + PatientId + '&Admissionid=' +Admissionid +'&HospitalID=' +HospitalID, { responseType: 'blob' });
  }
  SaveDischargeAfterFollowUp(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `SaveDischargeAfterFollowUpN`, postdata, this.httpOptions);
  }
  DeleteDischargeAfterFollowUp(postdata: any) {
    return this.https.post<any>(this.devApiUrl + `DeleteDischargeAfterFollowUp`, postdata, this.httpOptions);
  }
  FetchIsAdmissionRecVTEAndIntialAssessmentCompleted(AdmissionID: any, UserID: any, WorkStationID:any, HospitalID: string) { 
    return this.https.get(this.devApiUrl + 'FetchIsAdmissionRecVTEAndIntialAssessmentCompleted?' + 'AdmissionID=' + AdmissionID +'&UserID=' + UserID +'&WorkStationID=' + WorkStationID +'&HospitalID=' + HospitalID, this.httpOptions);
  }
  FetchPatientDataEForms(AdmissionID:any, WorkStationID:any,HospitalID:any) {
    return this.https.get<any>(this.devApiUrl + '/FetchPatientDataEForms?AdmissionID=' + AdmissionID + '&WorkStationID=' + WorkStationID + '&HospitalID=' + HospitalID + '', this.httpOptions);
  }
}
