import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidateEmployeeService } from './validate-employee.service';
import { details } from './urls';
import { UtilityService } from '../utility.service';
declare var $: any;

@Component({
  selector: 'app-validate-employee',
  templateUrl: './validate-employee.component.html',
  styleUrls: ['./validate-employee.component.scss']
})
export class ValidateEmployeeComponent extends BaseComponent {
  userForm: any;
  errorMessage: any;
  @Input() initialData: any;
  @Input() IsSignature: boolean = false;
  @Output() dataChanged = new EventEmitter<boolean>();
  @Output() signature = new EventEmitter<any>();
  @ViewChild('Password') Password!: ElementRef;
  list: any = [];
  url = '';
  constructor(private fb: FormBuilder, private service: ValidateEmployeeService, private us: UtilityService) {
    super()
   }

  close() {
    this.dataChanged.emit(false);
  }

  ngOnInit(): void {
    if(!this.IsSignature) {
      this.userForm = this.fb.group({
        UserName: this.initialData ? this.initialData.UserName : this.doctorDetails[0].UserName,
        Password: ['', Validators.required],
        Signature: ''
      });
    }
    else {
      this.userForm = this.fb.group({
        UserName: '',
        Password: '',
        Signature: ''
      });
    }    
  }

  validateuser() {
    this.con.validateDoctorLogin(this.userForm.get('UserName').value, this.userForm.get('Password').value, this.hospitalID).subscribe((response) => {
      this.errorMessage = '';
      if (response.length === 0) {
        this.errorMessage = "Invalid UserName / Password"
      } else if (response[0].CredentialsMessage) {
        this.errorMessage = response[0].CredentialsMessage;
      }
      else {
        this.dataChanged.emit(true);
        this.signature.emit(this.userForm.get('Signature').value);
      }
    },
      (err) => {

      })
  }

  clearuser() {
    this.userForm = this.fb.group({
      UserName: this.initialData ? this.initialData.UserName : this.doctorDetails[0].UserName,
      Password: ['', Validators.required]
    });

    this.errorMessage = '';
  }

  search(event: any) {
    if (event.target.value.length > 2) {
      this.url = this.service.getData(details.FetchEmpSignatures, { Filter: event.target.value,WorkStationID: 3413 ,HospitalID: this.hospitalID });
      this.us.get(this.url)
        .subscribe((response: any) => {
          if (response.Code == 200) {
           this.list = response.FetchEmpSignaturesDataList;
          }
        },
          (err) => {
          })
    }
  }

  onSelected(item: any) {
    this.list = [];

    this.userForm = this.fb.group({
      UserName: item.EmpNo,
      Password: ['', Validators.required],
      Signature: item.Signature
    });

    this.IsSignature = false;
  }

  ngAfterViewInit() {
    this.Password.nativeElement.focus();
  }

}
