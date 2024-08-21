import { Component, Renderer2, ElementRef, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppInjector } from 'src/app/services/app-injector.service';
import { ValidateEmployeeComponent } from '../validate-employee/validate-employee.component';
import { FormBuilder } from '@angular/forms';
import { otPatientDetails } from 'src/app/ot/ot-patient-casesheet/urls';
import { MedicalAssessmentService } from 'src/app/portal/medical-assessment/medical-assessment.service';
import { UtilityService } from '../utility.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { Observable, Subscription } from 'rxjs';
import { PatientAssessmentToolComponent } from 'src/app/ward/patient-assessment-tool/patient-assessment-tool.component';
import { GenericModalBuilder } from '../generic-modal-builder.service';
import { AllergyComponent } from '../allergy/allergy.component';
import { ReferralComponent } from '../referral/referral.component';
import { TemplateService } from '../template.service';
import { multipleSaveEnabledTemplates } from 'src/app/templates/template.utils';
declare var $: any;
@Injectable()
export abstract class DynamicHtmlComponent implements OnDestroy {
  tagIds: { id: string, value: string, userId?: string }[] = [];
  idValues: { [key: string]: string } = {};
  htmlShow: any;
  modalService: NgbModal;
  signatureList: any = [];
  signatureForm: any;
  formBuilder: any;
  urlcommon = '';
  urlcommonV = '';
  urlcommonP = '';
  commonservice: MedicalAssessmentService;
  utilityservice: UtilityService;
  tempService: TemplateService
  ms: GenericModalBuilder;
  patientData: any;
  ORPatientData: any;
  doctorData: any;
  hospitalID: any;
  FetcTemplateDefaultDataListM: any = [];
  defaultData: any;
  PatientsVitalsList: any;
  PatientsTemplateListData: any;
  bpSystolic: string = "";
  bpSysVal: string = "";
  bpDiastolic: string = "";
  bpDiaVal: string = "";
  temperature: string = "";
  tempVal: string = "";
  pulse: string = "";
  pulseVal: string = "";
  spo2: string = "";
  respiration: string = "";
  consciousness: string = "";
  o2FlowRate: string = "";
  errorMessages: any = [];
  facility: any;
  data$!: Observable<any[]>;
  urlDefault = '';
  dropdownItems = [
    { id:1, score: 0, image: 'assets/images/image1.png', text: 'No Hurt' },
    { id:2, score: 2, image: 'assets/images/image2.png', text: 'Hurts Little Bit' },
    { id:3, score: 4, image: 'assets/images/image3.png', text: 'Hurts Little More' },
    { id:4, score: 6, image: 'assets/images/image4.png', text: 'Hurts Even More' },
    { id:5, score: 8, image: 'assets/images/image5.png', text: 'Hurts Whole A Lot' },
    { id:6, score: 10, image: 'assets/images/image6.png', text: 'Hurts Worst' }
  ];
  minDate = new Date();
  isOthersSelected: { [key: string]: boolean } = {};

  subscription: Subscription;
  timerData: any = [];
  fromShared = false;

  dataChangesMap: { [key: string]: string } = {};
  
  constructor(private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef) {
    const injector = AppInjector.getInjector();
    this.modalService = injector.get<NgbModal>(NgbModal);
    this.formBuilder = injector.get<FormBuilder>(FormBuilder);
    this.commonservice = injector.get<MedicalAssessmentService>(MedicalAssessmentService);
    this.utilityservice = injector.get<UtilityService>(UtilityService);
    this.tempService = injector.get<TemplateService>(TemplateService);

    this.subscription = this.tempService.getMessage().subscribe(message => {
      if(message) {
        this.fromShared = true;
      }
    });

    
    this.ms = injector.get<GenericModalBuilder>(GenericModalBuilder);
    this.patientData = JSON.parse(localStorage.getItem("selectedView") || '{}');
    this.doctorData = JSON.parse(localStorage.getItem("doctorDetails") || '{}');
    this.facility = JSON.parse(localStorage.getItem("facility") || '{}');
    if (sessionStorage.getItem("otpatient") != 'undefined')
      this.ORPatientData = JSON.parse(sessionStorage.getItem("otpatient") || '{}');

    this.hospitalID = localStorage.getItem("hospitalId");
    this.signatureForm = this.formBuilder.group({
      Signature1: [''],
      Signature2: [''],
      Signature3: [''],
      Signature4: [''],
      Signature5: [''],
      Signature6: [''],
      Signature7: [''],
      Signature8: [''],
      Signature9: [''],
      Signature10: [''],
      Signature11: [''],
      Signature12: [''],
      Signature13: [''],
      Signature14: [''],
    });

    if(!this.fromShared) {
     this.fetchDefaults();
    }
  }

  ngOnDestroy() {
    this.tempService.sendMessage("");
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addToDataChangesMap(id: string) {
    const currentTemplateId = localStorage.getItem('currentTemplateId');
    if (multipleSaveEnabledTemplates.includes(Number(currentTemplateId))) {
      this.dataChangesMap[id] = this.doctorData[0].EmpId;
    }
  }

  removeFromDataChangesMap(id: string) {
    delete this.dataChangesMap[id];
  }

  findSignatureIds() {
    const keys = Object.keys(this.signatureForm.value);
    keys.forEach(key => {
      if(this.signatureForm.get(key).value && this.dataChangesMap[key]) {
        this.tagIds.push({
          id: key,
          value: '',
          userId: this.dataChangesMap[key]
        })
      }
    });
  }
  

  findHtmlTagIds(divcontent: ElementRef, requiredFields?: any): any {
    this.tagIds = [];
    this.idValues = {};
    this.errorMessages = [];
    const tempDiv = this.renderer.createElement('div');
    this.renderer.setProperty(tempDiv, 'innerHTML', divcontent.nativeElement.innerHTML);
    this.findSignatureIds();
    this.traverseElements(tempDiv, requiredFields);
    this.renderer.removeChild(this.el.nativeElement, tempDiv);
    if (this.errorMessages.length > 0) {
      // const modalRef = this.modalService.open(ErrorMessageComponent);
      const options: NgbModalOptions = {
        windowClass: 'ngb_error_modal'
      };
      const modalRef = this.modalService.open(ErrorMessageComponent, options);
      modalRef.componentInstance.errorMessages = this.errorMessages;
      modalRef.componentInstance.dataChanged.subscribe((data: string) => {
        modalRef.close();
      });
      return [];
    }
    else {
      return this.tagIds;
    }

  }

  fetchDefaults() {
    this.urlcommon = this.commonservice.getData(otPatientDetails.FetchTemplateDefaultData, { AdmissionID: this.patientData.AdmissionID == undefined ? this.ORPatientData.AdmissionID : this.patientData.AdmissionID, PatientId: this.patientData.PatientID == undefined ? this.ORPatientData.PatientID : this.patientData.PatientID, UserID: this.doctorData[0].UserId, WorkStationID: 3403, HospitalID: this.hospitalID });
    this.urlDefault = this.commonservice.getData(otPatientDetails.FetchPatientDataEFormsDataList, { AdmissionID: this.patientData.AdmissionID == undefined ? this.ORPatientData.AdmissionID : this.patientData.AdmissionID, WorkStationID: 3403, HospitalID: this.hospitalID });
    this.data$ = this.utilityservice.getMultipleData([this.urlcommon, this.urlDefault]);
    this.data$.subscribe(
      data => {
        if(data[0]) {
          this.defaultData = data;
          this.FetcTemplateDefaultDataListM = data[0].FetcTemplateDefaultDataListM;
          this.PatientsVitalsList = data[0].PatientSummaryVitalsDataList;
          this.PatientsTemplateListData = data[0].FetchPatientsTemplateListData;
  
          var bpsys = this.PatientsVitalsList.find((x: any) => x.Vital == "BP -Systolic");
          this.bpSystolic = bpsys === undefined ? '' : bpsys.Value;
          var bpdia = this.PatientsVitalsList.find((x: any) => x.Vital == "BP-Diastolic");
          this.bpDiastolic = bpdia === undefined ? '' : bpdia.Value;
          var temp = this.PatientsVitalsList.find((x: any) => x.Vital == "Temperature");
          this.temperature = temp === undefined ? '' : temp.Value;
          var pulse = this.PatientsVitalsList.find((x: any) => x.Vital == "Pulse");
          this.pulse = pulse === undefined ? '' : pulse.Value;
          var spo2 = this.PatientsVitalsList.find((x: any) => x.Vital == "SPO2");
          this.spo2 = spo2 === undefined ? '' : spo2.Value;
          var respiration = this.PatientsVitalsList.find((x: any) => x.Vital == "Respiration");
          this.respiration = respiration === undefined ? '' : respiration.Value;
          var consciousness = this.PatientsVitalsList.find((x: any) => x.Vital == "Consciousness");
          this.consciousness = consciousness === undefined ? '' : consciousness.Value;
          var o2FlowRate = this.PatientsVitalsList.find((x: any) => x.Vital == "O2 Flow Rate");
          this.o2FlowRate = o2FlowRate === undefined ? '' : o2FlowRate.Value;
          const dateTimeString = this.patientData.DOB;
          let datePart: any, timePart: any, adatePart: any, atimePart: any;
          if(dateTimeString) {
            datePart = dateTimeString?.split(" ")[0];
            timePart = dateTimeString?.split(" ")[1];
          }
          const adateTimeString = this.patientData.AdmitDate;
          if(adateTimeString) {
            adatePart = adateTimeString?.split(" ")[0];
            atimePart = adateTimeString?.split(" ")[1];
          }
          this.FetcTemplateDefaultDataListM = data[0].FetcTemplateDefaultDataListM.map((item: any) => ({
            id_value_pairs: [
              { id: "txt_generic_ProvisionalDiagnosis", value: item.ProvisionalDiagnosis },
              { id: "txt_generic_FinalDiagnosis", value: item.FinalDiagnosis },
              { id: "textbox_diagnosis", value: item.FinalDiagnosis + item.ProvisionalDiagnosis },
              { id: "textarea_diagnosis", value: item.FinalDiagnosis + item.ProvisionalDiagnosis },
              { id: "text_DiagnosisAr", value: item.FinalDiagnosis + item.ProvisionalDiagnosis },
              { id: "txt_generic_ChiefComplaint", value: item.ChiefComplaint },
              { id: "txt_generic_Investigations", value: item.Investigations },
              { id: "txt_generic_Medications", value: item.Medications },
              { id: "txt_generic_Procedures", value: item.Procedures },
              { id: "txt_generic_ProceduresA", value: item.Procedures },
  
              { id: "textbox_bp", value: this.bpSystolic + "/" + this.bpDiastolic },
              { id: "textbox_temp", value: this.temperature },
              { id: "textbox_pulse", value: this.pulse },
              { id: "textbox_rr", value: this.respiration },
              { id: "textbox_o2", value: this.o2FlowRate },
  
              { id: "textbox_AdmitDate", value: this.patientData.AdmitDate ? adatePart : '' },
              { id: "textbox_FullAge", value: this.patientData.FullAge },
              { id: "textbox_DOB", value: datePart },
              { id: "textbox_DOBTime", value: timePart },
              { id: "textbox_DoctorName", value: this.patientData.DoctorName },
              { id: "textbox_Gender", value: this.patientData.Gender },
              { id: "textbox_Height", value: this.patientData.Height },
              { id: "textbox_Nationality", value: this.patientData.Nationality },
              { id: "textbox_PatientName", value: this.patientData.PatientName },
              { id: "textbox_SSN", value: this.patientData.SSN },
              { id: "textbox_Weight", value: this.patientData.Weight },              
              { id: "text_Ward", value: this.patientData?.Ward },
              { id: "textbox_NationalityA", value: this.patientData.Nationality },
              { id: "textbox_PatientNameA", value: this.patientData.PatientName },
              { id: "textbox_SSNA", value: this.patientData.SSN },
              
              { id: "txt_generic_Religion", value: this.PatientsTemplateListData[0].Religion },
              { id: "txt_generic_City", value: this.PatientsTemplateListData[0].City },
              { id: "textbox_generic_Address01", value: this.PatientsTemplateListData[0].Address01 },
              { id: "txt_generic_PhoneNo", value: this.PatientsTemplateListData[0].PhoneNo },
              { id: "txt_generic_MobileNo", value: this.PatientsTemplateListData[0].MobileNo },
              { id: "txt_generic_SSN", value: this.PatientsTemplateListData[0].SSN },
              { id: "txt_generic_ContactNameKin", value: this.PatientsTemplateListData[0].ContactName },
              { id: "txt_generic_ContRelation", value: this.PatientsTemplateListData[0].ContRelation },
              { id: "txt_generic_PPhoneNo", value: this.PatientsTemplateListData[0].PPhoneNo },
              { id: "txt_generic_ContAddress", value: this.PatientsTemplateListData[0].ContAddress },
              { id: "txt_generic_ISVIP", value: this.PatientsTemplateListData[0].ISVIP },
              { id: "txt_generic_DOB", value: this.PatientsTemplateListData[0].DOB },
              { id: "txt_generic_Nationality", value: this.PatientsTemplateListData[0].Nationality },
              { id: "txt_generic_MarStatus", value: this.PatientsTemplateListData[0].MarStatus },
              { id: "txt_generic_FullAge", value: this.PatientsTemplateListData[0].FullAge },
              { id: "txt_generic_PatientName", value: this.PatientsTemplateListData[0].PatientName },
              { id: "txt_generic_ContPhoneNoKin", value: this.PatientsTemplateListData[0].ContPhoneNo }
            ]
          }));
        }

        if (data[1]) {
       
          const transformedData = data[1].FetchPatientDataEFormsDataList.map((item: any) => [
            { id: "ta_MainComplaint", value: item.ChiefComplaint },
            { id: "txt_generic_PatientID", value: item.PatientID },
            { id: "txt_generic_PatientType", value: item.PatientType === 'IP' ? 'Inpatient' : 'Outpatient' },
            { id: "textbox_areaunit", value: item.Ward + ' / ' + item.BedName },
            { id: "textbox_DOBB", value: item.DOB  },
            { id: "textbox_hr", value: item.Pulse},
            { id: "textbox_o2sat", value: item.SPO2},
            { id: "textbox_PrimaryDocEmpNO", value: item.EMPNO},
            { id: "textbox_PrimaryDocFullName", value: item.Primarydoctor},
            { id: "textbox_PrimaryDocFullNameEmpNo", value: item.EMPNO + ' - ' + item.Primarydoctor},
            { id: "text_Ward", value: item.Ward },
            { id: "text_bed", value: item.BedName },
            { id: "text_SERUMCREATININE", value: item.SERUMCREATININE },
            { id: "textbox_MothersName", value: item.MotherPatientName },
            { id: "textbox_MothersFileNumber", value: item.MotherSSN },
            { id: "textbox_BMI", value: item?.BMI },

            { id: "textbox_LMP", value: item?.LMP },
            { id: "textbox_EDD", value: item?.EDD },
            { id: "textbox_Gravidity", value: item?.Gravidity },
            { id: "textbox_Parity", value: item?.Parity },
            { id: "textbox_Abortions", value: item?.Abortions },
            { id: "txt_generic_BloodGroup", value: item?.BloodGroup },

            { id: "txt_generic_BabyRegCode", value: item?.BabyRegCode },
            { id: "txt_generic_BabyPatientName", value: item?.BabyPatientName },
            { id: "txt_generic_BabyGenderID", value: item?.BabyGenderID },
            { id: "txt_generic_BabyGender", value: item?.BabyGender },
            { id: "txt_generic_BabyDOB", value: item?.BabyDOB },
            { id: "txt_generic_BabyAdmitDate", value: item?.BabyAdmitDate },
            { id: "txt_generic_BabyNationality", value: item?.BabyNationality },
            { id: "txt_generic_BabyHeight", value: item?.BabyHeight },
            { id: "txt_generic_BabyWeight", value: item?.BabyWeight },
            

          ]);
        
          if (this.FetcTemplateDefaultDataListM[0].id_value_pairs.push) {
            transformedData.forEach((subArray: any) => {
              this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(...subArray);
            });
          } else {
            this.FetcTemplateDefaultDataListM = data[1].FetchPatientDataEFormsDataList.map((item: any) => ({
              id_value_pairs: [
                { id: "ta_MainComplaint", value: item.ChiefComplaint },
                { id: "txt_generic_PatientID", value: item.PatientID },
                { id: "txt_generic_PatientType", value: item.PatientType === 'IP' ? 'Inpatient' : 'Outpatient' },
                { id: "textbox_areaunit", value: item.Ward + ' / ' + item.BedName },
                { id: "textbox_hr", value: item.Pulse},
                { id: "textbox_o2sat", value: item.SPO2},
                { id: "textbox_PrimaryDocEmpNO", value: item.EMPNO},
                { id: "textbox_PrimaryDocFullName", value: item.Primarydoctor},
                { id: "textbox_PrimaryDocFullNameEmpNo", value: item.EMPNO + ' - ' + item.Primarydoctor},
                { id: "text_bed", value: item.BedName },
              ]
            }));
          }

          if(data[1].FetchPatientDataEFormsDataList[0].AllergyData) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "allergyDataDynamicDiv",
                value: data[1].FetchPatientDataEFormsDataList[0].AllergyData,
              }
            );
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "generic_AlleryType",
                value: data[1].FetchPatientDataEFormsDataList[0].IsAllergy === "1" ? 'Yes' : 'No',
              }
            );
          }

          if(data[1].FetchPatientDataEFormsDataList[0].PrevIPAdmitDate) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "txt_PreviousAdmissions",
                value: data[1].FetchPatientDataEFormsDataList[0].PrevIPAdmitDate,
              }
            );
          }

          if(data[1].FetchPatientDataEFormsDataList[0].PainScore) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "textbox_PainScale",
                value: data[1].FetchPatientDataEFormsDataList[0].PainScore,
              }
            );
          }
          
          var pastsurgery = data[1].FetchPatientSurgeryDataEFormsDataList?.map((item: any) => item.SurgeryName)?.join(', ')
          if(pastsurgery) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "ta_PastSurgicalHistory",
                value: pastsurgery,
              }
            );
          }

          var prevAdm = data[1].FetchPatientPrevAdmDiagnosisDataList?.map((item: any) => item.SurgeryName)?.join(', ')
          if(prevAdm) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "ta_PastMedicalHistory",
                value: prevAdm,
              }
            );
          }

          var prevSurgical = data[1].FetchPatientPrevSuregryDataList?.map((item: any) => item.DiseaseName)?.join(', ')
          if(prevSurgical) {
            this.FetcTemplateDefaultDataListM[0].id_value_pairs.push(
              {
                id: "ta_PrevSurgicalHistory ",
                value: prevSurgical,
              }
            );
          }
        }
        
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  private traverseElements(element: HTMLElement, requiredFields?: any) {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];

      const id = (child.getAttribute('id') ?? '') as string;
      if (id) {

        let value = '';
        const targetElement = document.getElementById(id);
        if (targetElement) {
          if (targetElement instanceof HTMLDivElement) {
            const selectedButton = child.querySelector('.selected');
            if (selectedButton) {
              value = selectedButton.textContent?.trim() ?? '';
            }
            else {
              const isActive = child.classList.contains('active');
              value = isActive ? 'true' : 'false';
            }
          }
          else if (targetElement instanceof HTMLInputElement) {
            value = targetElement.value;
          } else if (targetElement instanceof HTMLTextAreaElement) {
            value = targetElement.value;
          } else if (targetElement instanceof HTMLSelectElement) {
            value = targetElement.value;
          }
          else if (targetElement instanceof HTMLButtonElement) {
            value = targetElement.classList.contains('active') ? 'true' : 'false';
          } else {
            value = targetElement.innerText;
          }

          if (targetElement.classList.contains('ButtonScore')) {
            const imgElement = targetElement.querySelector('.imgpain') as HTMLImageElement;
            const pElement = targetElement.querySelector('.textpain') as HTMLParagraphElement;
            const divElement = targetElement.querySelector('.scorepain') as HTMLDivElement;
  
            const imgValue = imgElement ? imgElement.src : '';
            const pValue = pElement ? pElement.textContent?.trim() : '';
            const divValue = divElement ? divElement.textContent?.trim() : '';
  
            value = `${imgValue}$${pValue}$${divValue}`;
          }
        }
        if (requiredFields != undefined) {
          const errorMessage = requiredFields.find((rf: any) => rf.hasOwnProperty(id));
          if (errorMessage && !value) {
            this.errorMessages.push(errorMessage[id]);
          }
        }
        let data: any = { id: id, value: value };
        if (this.dataChangesMap[id]) {
          data.userId = this.dataChangesMap[id];
        }
        this.tagIds.push(data);
      }

      if (child.children.length > 0) {
        this.traverseElements(child as HTMLElement, requiredFields);
      }
    }
  }

  toggleSelection(event: Event) {
    const button = event.target as HTMLElement;
    const parentDiv = button.parentElement;
    const buttons = parentDiv?.querySelectorAll('.btn');
    buttons?.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  }

  toggleButtonSelection(event: Event) {
    const button = event.target as HTMLElement;
    const isActive = button.classList.contains('active');
    if (isActive) {
      button.classList.remove('active');
    } else {
      button.classList.add('active');
    }
  }
  selectItemNO(btn: string, item: any) {
    const button = $('#' + btn);
    if (button.length) {
      const imgElement = button.find('.imgpain');
      const pElement = button.find('.textpain');
      const divElement = button.find('.scorepain');

      if (imgElement.length) {
        imgElement.attr('src', item.image);
      }

      if (pElement.length) {
        pElement.text(item.text);
      }

      if (divElement.length) {
        divElement.text(item.score.toString());
      }

      if(Number(item.score) > 0) {
        const options: NgbModalOptions = {
          size: 'xl',
          windowClass: 'vte_view_modal'
        };
        // const modalRef = this.ms.openModal(PatientAssessmentToolComponent, {
        //   data: '',
        //   inputPainScore: item.id,
        //   readonly: false
        // }, options);
      }
    }
  }

  selectItem(btn: string, item: any) {
    const button = $('#' + btn);
    if (button.length) {
      const imgElement = button.find('.imgpain');
      const pElement = button.find('.textpain');
      const divElement = button.find('.scorepain');

      if (imgElement.length) {
        imgElement.attr('src', item.image);
      }

      if (pElement.length) {
        pElement.text(item.text);
      }

      if (divElement.length) {
        divElement.text(item.score.toString());
      }

      if(Number(item.score) > 0) {
        const options: NgbModalOptions = {
          size: 'xl',
          windowClass: 'vte_view_modal'
        };
        const modalRef = this.ms.openModal(PatientAssessmentToolComponent, {
          data: '',
          inputPainScore: item.id,
          readonly: false
        }, options);
      }
    }
  }

  toggleCheckboxSelection(event: Event) {
    const divElement = event.currentTarget as HTMLElement;
    if (divElement.classList.contains('active')) {
      divElement.classList.remove('active');
    } else {
      divElement.classList.add('active');
    }
  }

  unCheckboxSelection(id: string | string[]): void {
    if (Array.isArray(id)) {
      id.forEach(singleId => this.removeActiveClass(singleId));
    } else {
      this.removeActiveClass(id);
    }
  }

  private removeActiveClass(id: string): void {
    const element = document.getElementById(id);
    if (element && element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }


  selectCheckbox(id: string | string[]): void {
    if (Array.isArray(id)) {
      id.forEach(singleId => this.addActiveClass(singleId));
    } else {
      this.addActiveClass(id);
    }
  }
  
  private addActiveClass(id: string): void {
    const element = document.getElementById(id);
    if (element && !element.classList.contains('active')) {
      element.classList.add('active');
    } else if (element && element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }

  showdefault(element: HTMLElement) {

    if (this.FetcTemplateDefaultDataListM?.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i] as HTMLElement;

        const id = (child.getAttribute('id') ?? '') as string;
        if (id) {
          const idvalue = this.FetcTemplateDefaultDataListM.map((item: any) => {
            const val = item.id_value_pairs.find((pair: any) => pair.id === id);
            return val ? val.value : null;
          });

          const targetElement = document.getElementById(id);
          if (targetElement && idvalue[0]) {
            if (targetElement instanceof HTMLInputElement ||
              targetElement instanceof HTMLTextAreaElement) {
              (targetElement as HTMLInputElement | HTMLTextAreaElement).value = idvalue[0] ? idvalue[0] : '';
            }
            else if (targetElement instanceof HTMLSelectElement) {
              (targetElement as HTMLSelectElement).value = idvalue[0] ? idvalue[0] : '0';
            }
            else if (targetElement instanceof HTMLSpanElement) {
              (targetElement as HTMLSpanElement).innerText = idvalue[0] ? idvalue[0] : '';
            } else if (targetElement instanceof HTMLDivElement && idvalue[0]) {
              const buttons = targetElement.querySelectorAll('button');
              buttons.forEach(button => {
                if (button.innerText.trim() === idvalue[0]) {
                  button.classList.add('selected');
                } else {
                  button.classList.remove('selected');
                }
              });
            }

            if(targetElement instanceof HTMLDivElement && targetElement.id === 'allergyDataDynamicDiv') {
              targetElement.innerHTML = idvalue[0];
            }
          }

          const targetElementClass = document.getElementsByClassName(id);

          if (targetElementClass.length > 0 && idvalue[0]) {
            Array.from(targetElementClass).forEach(element => {
              if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                element.value = idvalue[0] ? idvalue[0] : '';
              }
              else if(element instanceof HTMLSpanElement) {
                element.innerText = idvalue[0] ? idvalue[0] : '';
              }
            });
          }
        }

        if (child.children.length > 0) {
          this.showdefault(child);
        }
      }
      this.cdr.detectChanges();
    }
  }

  showElementsData(element: HTMLElement, dataFromDB: { id: string, value: string, userId?: any }[], issame: any = true, tem?: any) {    if (tem) {
      this.signatureForm.patchValue({
        Signature1: tem.Signature1,
        Signature2: tem.Signature2,
        Signature3: tem.Signature3,
        Signature4: tem.Signature4,
        Signature5: tem.Signature5,
        Signature6: tem.Signature6,
        Signature7: tem.Signature7,
        Signature8: tem.Signature8,
        Signature9: tem.Signature9,
        Signature10: tem.Signature10,
      });

      if (tem.Signature1) {
        this.signatureList.push({ class: 'Signature1', signature: tem.Signature1 });
      }

      if (tem.Signature2) {
        this.signatureList.push({ class: 'Signature2', signature: tem.Signature2 });
      }

      if (tem.Signature3) {
        this.signatureList.push({ class: 'Signature3', signature: tem.Signature3 });
      }

      if (tem.Signature4) {
        this.signatureList.push({ class: 'Signature4', signature: tem.Signature4 });
      }

      if (tem.Signature5) {
        this.signatureList.push({ class: 'Signature5', signature: tem.Signature5 });
      }

      if (tem.Signature6) {
        this.signatureList.push({ class: 'Signature6', signature: tem.Signature6 });
      }

      if (tem.Signature7) {
        this.signatureList.push({ class: 'Signature7', signature: tem.Signature7 });
      }

      if (tem.Signature8) {
        this.signatureList.push({ class: 'Signature8', signature: tem.Signature8 });
      }
      if (tem.Signature9) {
        this.signatureList.push({ class: 'Signature9', signature: tem.Signature9 });
      }
      if (tem.Signature10) {
        this.signatureList.push({ class: 'Signature10', signature: tem.Signature10 });
      }
    }
    const currentTemplateId = localStorage.getItem('currentTemplateId');
    if (multipleSaveEnabledTemplates.includes(Number(currentTemplateId))) {
      const regex = /\bSignature\d+\b/g;
      const signatureData = dataFromDB.filter((item: any) => item.id.match(regex));
      signatureData.forEach((signature: any) => {
        this.dataChangesMap[signature.id] = signature.userId;
        if(signature.userId !== this.doctorData[0].EmpId) {
          (this as any)[signature.id].elementRef.nativeElement.parentElement.parentElement.classList.add('disabled');
        }        
      });
    }

    this.timerData = dataFromDB.filter((item: any) => item.id.includes('textbox_generic_time'));

    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i] as HTMLElement;

      const id = (child.getAttribute('id') ?? '') as string;
      if (id) {
        const data = dataFromDB.find(item => item.id === id);
        let value = data ? data.value : '';

        const targetElement = document.getElementById(id);
        if (targetElement) {
          if (targetElement instanceof HTMLInputElement ||
            targetElement instanceof HTMLTextAreaElement ||
            targetElement instanceof HTMLSelectElement) {
            (targetElement as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = value;
            
            if (multipleSaveEnabledTemplates.includes(Number(currentTemplateId))) {
              if (data?.userId) {
                this.dataChangesMap[id] = data.userId;
                if (data?.userId !== this.doctorData[0].EmpId) {
                  targetElement.setAttribute('disabled', 'true');
                }
              }
            } else if (!issame && value) {
              targetElement.setAttribute('disabled', 'true');
            }
          } else if (targetElement instanceof HTMLDivElement) {
            if (targetElement.classList.contains('toggle__switch')) {
              const buttons = targetElement.querySelectorAll('.btn');
              buttons.forEach(button => {
                if (button?.textContent?.trim() === value) {
                  button.classList.add('selected');
                }
                else {
                  button.classList.remove('selected');
                }
              });

              if (!issame) {
                targetElement.classList.add('disabled');
              }
            } else if (targetElement.classList.contains('custom_check')) {
              if (value === "true") {
                targetElement.classList.add('active');
                if (multipleSaveEnabledTemplates.includes(Number(currentTemplateId))) {
                  if (data?.userId) {
                    this.dataChangesMap[id] = data.userId;
                    if (data?.userId !== this.doctorData[0].EmpId) {
                      targetElement.classList.add('disabled');
                    }
                  }
                } else if (!issame) {
                  targetElement.classList.add('disabled');
                }
              }
            }
          } else if (targetElement instanceof HTMLButtonElement) {
            if (value === "true") {
              targetElement.classList.add('active');
              if (multipleSaveEnabledTemplates.includes(Number(currentTemplateId))) {
                if (data?.userId) {
                  this.dataChangesMap[id] = data.userId;
                  if (data?.userId !== this.doctorData[0].EmpId) {
                    targetElement.disabled = true;
                  }
                }
              } else if(!issame) {
                targetElement.disabled = true;
              }
            }
          }
          else {
            targetElement.innerText = value;
          }

          if (targetElement.classList.contains('ButtonScore')) {
            const [imgValue, pValue, divValue] = value.split('$');
            const imgElement = targetElement.querySelector('.imgpain') as HTMLImageElement;
            const pElement = targetElement.querySelector('.textpain') as HTMLParagraphElement;
            const divElement = targetElement.querySelector('.scorepain') as HTMLDivElement;

            if (imgElement) imgElement.src = imgValue;
            if (pElement) pElement.textContent = pValue;
            if (divElement) divElement.textContent = divValue;

         }
        }
        this.tagIds.push({ id: id, value: value });
      }

      if (child.children.length > 0) {
        this.showElementsData(child, dataFromDB, issame);
      }
    }
    this.cdr.detectChanges();
  }

  getValueById(id: string): any {
    const selectedButton = document.getElementById(id)?.querySelector('.selected');
    return selectedButton ? selectedButton.textContent?.trim() : '';
  }

  setValueById(id: any, value: any) {
    const targetElement = document.getElementById(id);
    const buttons = targetElement?.querySelectorAll('.btn');
    buttons?.forEach(button => {
      if (button?.textContent?.trim() === value) {
        button.classList.add('selected');
      }
      else {
        button.classList.remove('selected');
      }
    });
  }

  bindTextboxValue(id: any, value: any) {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      (targetElement as HTMLInputElement).value = value;
    }
  }

  getClassExistence(id: any) {
    const targetElement = document.getElementById(id);

    if (targetElement && targetElement.classList.contains("active")) {
      return true;
    } else {
      return false;
    }
  }

  getClassButtonSelectionExistence(id: any) {
    const targetElement = document.getElementById(id);

    if(targetElement) {
      const selectedButton = targetElement.querySelector('.btn.selected');
      if (selectedButton) {
        return selectedButton?.textContent?.trim();
      } 
    }
   
    return '';
  }

  addSignature(signatureClassName: any) {
    const modalRef = this.modalService.open(ValidateEmployeeComponent);
    modalRef.componentInstance.IsSignature = true;
    modalRef.componentInstance.dataChanged.subscribe((data: string) => {
      if (data) {
        modalRef.componentInstance.signature.subscribe((data: string) => {
          if (data) {
            this.signatureList.push({ class: signatureClassName, signature: data });
            this.base64Signature(signatureClassName, data);
          }
          modalRef.close();
        });
      }
      modalRef.close();
    });
  }

  getSignature(signatureClassName: any): string | null {
    const signatureData = this.signatureList.find((signature: any) => signature.class === signatureClassName);
    return signatureData ? signatureData.signature : null;
  }

  clearSignature(signatureClassName: any) {
    const index = this.signatureList.findIndex((signature: any) => signature.class === signatureClassName);
    if (index !== -1) {
      this.signatureList.splice(index, 1);
      this.base64Signature(signatureClassName, '');
    }
  }

  base64Signature(key: any, event: any) {
    if(event) {
      this.addToDataChangesMap(key);
    } else {
      this.removeFromDataChangesMap(key);
    }
    switch (key) {
      case 'Signature1':
        this.signatureForm.patchValue({ Signature1: event });
        break;
      case 'Signature2':
        this.signatureForm.patchValue({ Signature2: event });
        break;
      case 'Signature3':
        this.signatureForm.patchValue({ Signature3: event });
        break;
      case 'Signature4':
        this.signatureForm.patchValue({ Signature4: event });
        break;
      case 'Signature5':
        this.signatureForm.patchValue({ Signature5: event });
        break;
      case 'Signature6':
        this.signatureForm.patchValue({ Signature6: event });
        break;
      case 'Signature7':
        this.signatureForm.patchValue({ Signature7: event });
        break;
      case 'Signature8':
        this.signatureForm.patchValue({ Signature8: event });
        break;
      case 'Signature9':
        this.signatureForm.patchValue({ Signature9: event });
        break;
      case 'Signature10':
        this.signatureForm.patchValue({ Signature10: event });
        break;
      default:
    }
  }

  onOptionChange(event: any, selectId: string): void {
    const selectedOption = event.target.value;
    if (selectedOption === 'Others') {
      this.isOthersSelected[selectId] = true;
    } else {
      delete this.isOthersSelected[selectId];
    }
  }

  hide(elementId: string) {
    const element = this.el.nativeElement.querySelector(`#${elementId}`);
    if (element) {
      this.renderer.setStyle(element, 'display', 'none');
    }
  }

  show(elementId: string) {
    const element = this.el.nativeElement.querySelector(`#${elementId}`);
    if (element) {
      this.renderer.setStyle(element, 'display', 'block');
    }
  }

  toggleVisibility(showElementId: string, hideElementId: string) {
    const showElement = this.el.nativeElement.querySelector(`#${showElementId}`);
    const hideElement = this.el.nativeElement.querySelector(`#${hideElementId}`);

    if (showElement && hideElement) {
      this.renderer.setStyle(showElement, 'display', 'block');
      this.renderer.setStyle(hideElement, 'display', 'none');
    }
  }

  showDefaultOntoggle(id: string) {
    setTimeout(() => {
      const idvalue = this.FetcTemplateDefaultDataListM.map((item: any) => {
        const val = item.id_value_pairs.find((pair: any) => pair.id === id);
        return val ? val.value : null;
      });

      const targetElement = document.getElementById(id);
      if (targetElement) {
        (targetElement as HTMLInputElement).value = idvalue;

        if(targetElement instanceof HTMLDivElement && targetElement.id === 'allergyDataDynamicDiv') {
          targetElement.innerHTML = idvalue[0];
        }
      }
    }, 500);
  }

  setCurrentTime(): string {
    const now = new Date();
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    return `${hours}:${minutes}`;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  openAllergyModal() {
    const options: NgbModalOptions = {
      size: 'xl',
      windowClass: 'vte_view_modal'
    };
    // const modalRef = this.ms.openModal(AllergyComponent, {
    //   data: '',
    //   readonly: false
    // }, options);

    const modalRef = this.modalService.open(AllergyComponent, options);
    modalRef.componentInstance.dataChanged.subscribe((data: string) => {
      modalRef.close();
      this.fetchDefaults();
      setTimeout(() => {
      this.showDefaultOntoggle('allergyDataDynamicDiv')
      , 5000});
      
    });
  }

  getCheckBoxStatus(id: string): boolean {
    if (document.getElementById(id)?.classList.contains('active')) {
      return true;
    } 

    return false;
  }

  checkinputvalue(id: string): boolean {
    if($('#' + id).val()) {
      return true;
    }
    return false;
  }

  onTimeChange(event: any, key: any) {
    const selector = this.timerData.find((ts: any) => ts.id === key);

    if(selector) {
      selector.value = event.hour + ':' + event.minute;
    }
    else {
      this.timerData.push({'id': key, 'value': event.hour + ':' + event.minute})
    }
  }

  
  getHours(id: any) {
    const selector = this.timerData.find((ts: any) => ts.id === id);
    if(selector) {
      return selector.value.split(':')[0];
    }
  }

  getMinutes(id: any) {
    const selector = this.timerData.find((ts: any) => ts.id === id);
    if(selector) {
      return selector.value.split(':')[1];
    }
  }

  referclick() {
    const options: NgbModalOptions = {
      size: 'xl',
      windowClass: 'vte_view_modal'
    };
    const modalRef = this.ms.openModal(ReferralComponent, {
      data: '',
      readonly: true
    }, options);
  }

  addListeners() {
    const container: any = document.getElementsByClassName('main-container');
    if (container.length > 0) {
      container[0].addEventListener('input', (event: any) => {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
          if (event.target.value !== null && event.target.value !== undefined && event.target.value.trim() !== '') {
            this.addToDataChangesMap(event.target.id);
          } else {
            this.removeFromDataChangesMap(event.target.id);
          }
        }
      });
      container[0].addEventListener('click', (event: any) => {
        if (event.target.parentElement?.classList?.contains('custom_check')) {
          if (this.dataChangesMap[event.target.parentElement.id]) {
            this.removeFromDataChangesMap(event.target.parentElement.id);
          } else {
            this.addToDataChangesMap(event.target.parentElement.id);
          }          
        } else if (event.target.parentElement?.parentElement?.classList?.contains('custom_check')){
          if (this.dataChangesMap[event.target.parentElement.parentElement.id]) {
            this.removeFromDataChangesMap(event.target.parentElement.parentElement.id);
          } else {
            this.addToDataChangesMap(event.target.parentElement.parentElement.id);
          }          
        } else if(event.target instanceof HTMLButtonElement && event.target.parentElement?.classList?.contains('toggle__switch')) {
          this.addToDataChangesMap(event.target.parentElement.id);
        }
      });
    }
  }
}
