import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private _ngToaster: NgToastService) {}
  showSuccess(message: string) {
    this._ngToaster.success({
      duration: 2000,
      detail: message,
      position: 'topCenter',
    });
  }
  showError(message: string) {
    this._ngToaster.error({
      duration: 2000,
      detail: message,
      position: 'topCenter',
    });
  }
}
