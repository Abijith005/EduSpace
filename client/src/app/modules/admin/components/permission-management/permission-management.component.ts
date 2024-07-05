import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
})
export class PermissionManagementComponent {
  totalPages = 10;
  currentPage = 1;
  constructor(private _modalService: ModalService) {}

  isVisible$ = this._modalService.isVisible$;
  isDropdownOpen = false;

  toggleDropdown() {
    console.log('isdeorpwon',this.isDropdownOpen);
    
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  verify() {
    // Verify logic here
    this.isDropdownOpen = false;
  }
  
  reject() {
    // Reject logic here
    this.isDropdownOpen = false;
  }
  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }
  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
