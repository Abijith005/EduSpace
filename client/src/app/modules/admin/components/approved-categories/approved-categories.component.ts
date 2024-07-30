import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { ToasterService } from '../../../shared/toaster.service';
interface Icategories {
  _id: string;
  title: string;
}
@Component({
  selector: 'app-approved-categories',
  templateUrl: './approved-categories.component.html',
  styleUrl: './approved-categories.component.css',
})
export class ApprovedCategoriesComponent implements OnDestroy {
  @Input() categories!: Icategories[];
  @Input() userId!: string;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() updateData = new EventEmitter<string[]>();

  removedCategories: string[] = [];

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  toggleChecked(categoryId: string): void {
    const index = this.removedCategories.indexOf(categoryId);
    if (index > -1) {
      this.removedCategories.splice(index, 1);
    } else {
      this.removedCategories.push(categoryId);
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }

  updateApprovedCategory() {
    this._adminService
      .removeApprovedCategory(this.removedCategories, this.userId)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
        if (res.success) {
          this.updateData.emit(this.removedCategories);
          this.closeModal();
        }
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
