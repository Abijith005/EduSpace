import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  public categoryForm: FormGroup = new FormGroup({});
  private _ngUnsubscribe = new Subject<void>();
  @Output() modalClosed = new EventEmitter();
  constructor(private _adminService: AdminService, private _fb: FormBuilder,private _toasterService:ToasterService) {}

  ngOnInit(): void {
   this.categoryForm= this._fb.group({
      title: ['', [Validators.required]],
      icon: ['', Validators.required],
    });

    
  }

  get formcontrols() {
    return this.categoryForm.controls;
  }

  OnSubmit() {
    if (!this.categoryForm.valid) {
      return;
    }
    const data = this.categoryForm.getRawValue();
    this._adminService
      .addCategory(data)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((res) => {
       this._toasterService.toasterFunction(res)
       if (res.success) {
        this.closeModal()
       }
      });
  }

  closeModal() {
    this.modalClosed.emit();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
