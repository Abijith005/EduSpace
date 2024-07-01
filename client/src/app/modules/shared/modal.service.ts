import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isVisible = new BehaviorSubject<boolean>(false);
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
}
