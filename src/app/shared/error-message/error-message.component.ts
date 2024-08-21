import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  @Input() public errorMessages: any = [];
  @Output() dataChanged = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  okclick() {
    this.dataChanged.emit(false);
  }

}
