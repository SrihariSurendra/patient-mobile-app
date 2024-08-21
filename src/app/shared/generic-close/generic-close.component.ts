import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-generic-close',
  templateUrl: './generic-close.component.html',
  styleUrls: ['./generic-close.component.scss']
})
export class GenericCloseComponent implements OnInit {
  @Input() title = 'nonname';
  constructor(private us: UtilityService) { }

  ngOnInit(): void {
  }

  close() {
    this.us.closeModal();
  }

}
