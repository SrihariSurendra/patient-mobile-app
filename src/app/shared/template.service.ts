import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor() { }

  private subject = new BehaviorSubject("");

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage() {
    return this.subject.asObservable();
  }
}
