import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private _ngToaster: NgToastService) {}
  toasterFunction(data: { success: boolean; message: string }) {
    if (data.success) {
      console.log('toaster works');
      this._ngToaster.success({
        duration: 2000,
        detail: data.message,
        position: 'topCenter',
      });
    } else {
      this._ngToaster.error({
        duration: 2000,
        detail: data.message,
        position: 'topCenter',
      });
    }
  }
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
  showWarning(message: string) {
    this._ngToaster.info({
      duration: 2000,
      detail: message,
      position: 'topCenter',
    });
  }
}
