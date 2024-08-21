import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Patterns } from 'global-constants';
import * as moment from 'moment';
import { ConfigService } from '../services/config.service';
import { LoaderService } from '../services/loader.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  otpDetails: any;
  selectedLang: any;
  position!: number;
  showLogin: boolean = true;
  apiResponse: any = {};
  isSubmitted: boolean = false;
  locationList: any;
  doctorDetails: any;
  errorMessage: any;
  location: any;
  trailCount = 0;

  otp = {
    one: "",
    two: "",
    three: "",
    four: ""
  }
  patientInfo: any;
  listOfLanguages = [
    { Id: 1, value: "English", code: "en" },
    { Id: 2, value: "العربية", code: "ar" }
  ]
  timeLeft: number = 60;
  interval: any;
  showResendOTP: boolean = false;
  currentdate: any;
  currenttime: Date = new Date();
  datetime: any;
  loginLangData: any;
  isDefaultPwd = false;
  employeeChangePwdForm!: FormGroup;

  constructor(private fb: FormBuilder, private config: ConfigService, private router: Router, private loader: LoaderService) {
    localStorage.clear()
    sessionStorage.clear();
    if ("lang" in localStorage) {
      let langCode = localStorage.getItem('lang');
      if (langCode === "en") {
        this.selectedLang = { Id: 1, value: "English", code: "en" };
      } else if (langCode === "ar") {
        this.selectedLang = { Id: 2, value: "Arabic", code: "ar" };
      }
      this.loader.setDefaultLangCode(langCode);
      this.getSelectedLangData(langCode);
      this.getDate(langCode);
    } else {
      this.selectedLang = { Id: 1, value: "English", code: "en" };
      localStorage.setItem("lang", `${this.selectedLang.code}`);
      this.loader.setDefaultLangCode(this.selectedLang.code);
      this.getSelectedLangData(this.selectedLang.code);
      this.getDate(this.selectedLang.code);
    }
    this.position = 1;

  }

  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      Location: ['', Validators.required]
    });
    this.FetchFetchHospitalLocations();
    this.startClock();
  }

  FetchFetchHospitalLocations() {
    this.config.fetchFetchHospitalLocations().subscribe((response) => {
      if (response.Status === "Success") {
        this.locationList = response.HospitalLocationsDataList;
        if (response.HospitalLocationsDataList.length == 1) {
          this.loginForm.get('Location')?.setValue(response.HospitalLocationsDataList[0].HospitalID);
        }
      } else {
      }
    },
      (err) => {

      })
  }

  onSubmit(): void {

    if (this.loginForm.valid) {
      this.isSubmitted = false;
      this.validateDoctorLogin();

    } else {
      this.showLogin = true;
      this.isSubmitted = true;
    }

     //localStorage.setItem("loginDetails", JSON.stringify(this.loginForm.value))
  }

  validateDoctorLogin() {
    this.errorMessage ="";
    if (this.loginForm.valid) {
      //this.config.validateDoctorLogin(this.loginForm.get('UserName').value,this.loginForm.get('Password').value,this.loginForm.get('Location').value).subscribe((response) => {
        this.config.validateDoctorLoginHH(this.loginForm.get('UserName').value,this.loginForm.get('Password').value, this.trailCount, this.loginForm.get('Location').value).subscribe((response) => {
        if(response.Code === 604) {
          this.trailCount++;
          this.errorMessage = response.Message;
          $("#loginValidationMsg").modal('show');
        }
        // else if (response.length === 0) {
        //   this.errorMessage = "Invalid UserName / Password"
        // } else if (response[0].CredentialsMessage) {
        //   this.errorMessage = "Invalid UserName / Password"
        // }
        else {
          this.trailCount = 0;
          localStorage.setItem("doctorDetails", JSON.stringify(response.SmartDataList))
          localStorage.setItem("hospitalId", this.loginForm.get('Location').value)
          localStorage.setItem("isLoggedIn", 'true');
          this.location =  this.locationList.filter((a: any) => a.HospitalID == this.loginForm.get('Location').value)[0].Name;
          localStorage.setItem("locationName", this.location);
          localStorage.setItem("IsDoctorLogin", response.SmartDataList[0].IsDoctor);
          localStorage.setItem("IsEmergency", response.SmartDataList[0].IsEmergencyDoc);
          localStorage.setItem("IsNurse", response.SmartDataList[0].IsNurse);
          localStorage.setItem("IsHeadNurse", response.SmartDataList[0].IsERHeadNurse);
          localStorage.setItem("IsAKUNurse", response.SmartDataList[0].IsAKUNurse);
          if(response.SmartDataList[0].FacilityId!=null)
          localStorage.setItem("facility", response.SmartDataList[0].FacilityId);

          this.isDefaultPwd = response.SmartDataList[0].IsdefaultPsw === 'False' ? false : true;
          if(this.isDefaultPwd) {
            this.router.navigate(['/login/changepassword'])
          }

          else if(response.SmartDataList[0].IsDoctor) {
            this.router.navigate(['/login/doctor-home'])
          }
          else if(response.SmartDataList[0].IsERHeadNurse) {
            //this.router.navigate(['/emergency/beds']);
            localStorage.setItem("fromLoginToWard", 'true');
            this.router.navigate(['/ward']);
          }
          // else if (response.SmartDataList[0].IsNurse) {
          //   this.router.navigate(['/emergency/emr-hod-worklist'])
          // }
          else if (response.SmartDataList[0].IsNurse) {
            this.router.navigate(['/emergency/worklist'])
          }
          else if(response.SmartDataList[0].IsORHeadNurse) {
            this.router.navigate(['/ot/ot-dashboard'])
          }
          else if(response.SmartDataList[0].IsAKUNurse) {
            this.router.navigate(['/dialysis/aku-worklist'])
          }
          else {
            this.router.navigate(['/suit'])
          }
        }
      },
        (err) => {

        })
    }
  }

  backToLogin() {
    this.showLogin = true;
  }

  selectedLanguage(lang: any) {
    this.selectedLang = lang;
    localStorage.setItem("lang", `${this.selectedLang.code}`);
    this.loader.setDefaultLangCode(this.selectedLang.code);
    this.getSelectedLangData(this.selectedLang.code);
    this.getDate(this.selectedLang.code);
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
      if (this.timeLeft == 0) {
        this.pauseTimer();
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.showResendOTP = true;
  }
  showToastrModal() {
    $("#otpMessage").modal('show');
  }
  closeToastr() {
    $("#otpMessage").modal('hide');
  }
  // showOtpFailModal() {
  //   $("#otpFail").modal('show');
  // }
  // closeOtpFailModal() {
  //   $("#otpFail").modal('hide');
  // }
  getSelectedLangData(lang: any) {
    this.config.getSelectedLang(lang).subscribe((response: any) => {
      this.loginLangData = response;
      localStorage.setItem("langData", JSON.stringify(this.loginLangData))
    });
  }
  getDate(langCode: any) {
    if (langCode === "en") {
      this.currentdate = moment(new Date()).format('DD-MMM-YYYY');
    } else if (langCode === "ar") {
    }
  }

  ngOnDestroy(): void {
    this.stopClock();
  }

  startClock(): void {
    this.interval = setInterval(() => {
      this.currenttime = new Date();
    }, 1000);
  }

  stopClock(): void {
    clearInterval(this.interval);
  }

}
