import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isVisible = new BehaviorSubject<boolean>(false);
  private isNestedVisible = new BehaviorSubject<boolean>(false);
  isNestedVisible$ = this.isNestedVisible.asObservable();
  isVisible$ = this.isVisible.asObservable();
  constructor() {}

  openModal() {
    this.isVisible.next(true);
    document.body.classList.add('open-modal');
  }

  closeModal() {
    this.isVisible.next(false);
    document.body.classList.remove('open-modal');
  }

  openNestedModal() {
    this.isNestedVisible.next(true);
    document.body.classList.add('open-modal');
  }
  closeNestedModal() {
    this.isNestedVisible.next(false);
    document.body.classList.remove('open-modal');
  }
}
