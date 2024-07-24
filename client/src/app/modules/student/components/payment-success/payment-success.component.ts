import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',
})
export class PaymentSuccessComponent {
  @Output() nestedModalClosed = new EventEmitter<void>();
  @Input() price!: number;

  constructor(private _router: Router) {}
  amount = this.price + this.price * 0.05;
  onCancel() {
    this.nestedModalClosed.emit();
  }

  onGotoSubscription() {
    this._router.navigate(['student/subscriptions']);
  }
}
