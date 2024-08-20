import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',
})
export class PaymentSuccessComponent implements OnInit {
  @Output() nestedModalClosed = new EventEmitter<void>();
  @Input() price!: number;
  amount: number = 0;

  constructor(private _router: Router) {}
  ngOnInit(): void {
    this.amount = Number(this.price) + Number(this.price) * 0.05;
  }

  onCancel() {
    this.nestedModalClosed.emit();
  }

  onGotoSubscription() {
    this.nestedModalClosed.emit();
    this._router.navigate(['student/subscriptions']);
  }
}
