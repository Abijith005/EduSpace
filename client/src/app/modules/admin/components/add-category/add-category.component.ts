import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  public categoryForm: FormGroup = new FormGroup({});
  private _ngUnsubscribe = new Subject<void>();

  constructor(private _adminService: AdminService, private _fb: FormBuilder) {}

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
        console.log(res);
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
