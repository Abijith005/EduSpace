import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.css',
})
export class TeacherProfileComponent {
  
  constructor(private _modalService: ModalService) {}
  
  isVisible$ = this._modalService.isVisible$;
  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }
}
