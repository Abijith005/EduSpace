import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-managemet',
  templateUrl: './payment-managemet.component.html',
  styleUrl: './payment-managemet.component.css'
})
export class PaymentManagemetComponent {
  totalPages = 10;
  currentPage = 1;

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
