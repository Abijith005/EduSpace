import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Icertificate } from '../../../../interfaces/categoryRequest';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-list-cetificates',
  templateUrl: './list-cetificates.component.html',
  styleUrl: './list-cetificates.component.css',
})
export class ListCetificatesComponent implements OnDestroy {
  @Input() certificates!: Icertificate[];
  @Input() requestId!: string;
  @Output() modalClosed = new EventEmitter();
  selectedCertificate: string = '';
  isNestedVisible$ = this._modalService.isNestedVisible$;
  isDropdownOpen = false;

  private _ngUnsubscribe$ = new Subject<void>();

  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService,
    private _toaster: ToasterService
  ) {}

  closePdfModal() {
    this._modalService.closeNestedModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }

  verifyCertificate(certificate: any) {
    certificate.verified = true;
  }

  rejectCertificate(certificate: any) {
    certificate.verified = false;
  }

  viewCertificate(url: string) {
    this.selectedCertificate = url;
    this._modalService.openNestedModal();
  }

  updateCertificates() {
    this._adminService
      .updateCertificateStatus({
        certificates: this.certificates,
        requestId: this.requestId,
      })
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toaster.toasterFunction(res);
        if (res.success) {
          this.closeModal();
        }
      });
  }
  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
