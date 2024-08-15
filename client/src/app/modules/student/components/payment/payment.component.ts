import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { IcourseDetails } from '../../../../interfaces/courseDetails';
import { PaymentService } from '../../payment.service';
import { WindowRefService } from '../../window-ref.service';
import { Subject, takeUntil } from 'rxjs';
import { environments } from '../../../../../environments/environments';
import { ToasterService } from '../../../shared/toaster.service';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paymentRef', { static: false }) paymentRef!: ElementRef;
  @Output() modalClosed = new EventEmitter<void>();
  @Input() courseDetails!: IcourseDetails;
  orderRef: string | undefined;
  selectedPaymentMethod: string = '';

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _paymentService: PaymentService,
    private _windRef: WindowRefService,
    private _toaster: ToasterService,
    private _cdr: ChangeDetectorRef,
    private _modalService: ModalService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.selectedPaymentMethod === 'paypal') {
      this.renderPaypalButton();
    }
  }

  subtotal(amount: number, tax: number) {
    return (amount + amount * (tax / 100)).toFixed(2);
  }

  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
    if (method === 'paypal') {
      this._cdr.detectChanges();
      setTimeout(() => {
        this.renderPaypalButton();
      }, 0);
    }
  }

  isPaymentMethod(method: string) {
    return this.selectedPaymentMethod === method;
  }

  async renderPaypalButton(): Promise<void> {
    if (!this.paymentRef) {
      console.error('Payment reference is not available');
      return;
    }
    paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 40,
          tagline: false,
        },
        createOrder: async (data: any, actions: any) => {
          try {
            const response: any = await this._paymentService
              .createOrder(this.courseDetails.price)
              .toPromise();
            this.orderRef = response.orderRef;
            console.log('Order created with ID:', response.id);
            return response.id;
          } catch (error) {
            console.error('Error creating order:', error);
            return '';
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const orderData: any = await this._paymentService
              .captureOrder(data.orderID)
              .toPromise();
            const errorDetail =
              Array.isArray(orderData.details) && orderData.details[0];
            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
              return actions.restart();
            }
            const transaction =
              orderData.purchase_units[0].payments.captures[0];
            console.log('Transaction completed:', transaction);
          } catch (error) {
            console.error('Error capturing order:', error);
          }
        },
        onCancel: () => {
          console.log('Payment cancelled');
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
        },
      })
      .render(this.paymentRef.nativeElement);
  }

  createRazorpayOrder() {
    const amount = parseFloat(this.subtotal(this.courseDetails.price, 5));
    this._paymentService
      .createRazorpayOrder(amount)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res: any) => {
        const orderId = res.order.id;
        this.payWithRazorpay(amount, orderId);
      });
  }

  payWithRazorpay(price: number, order_id: string) {
    const options: any = {
      key: environments.razorpay_id,
      amount: price * 100,
      currency: 'INR',
      name: 'EduSpace',
      image: '/images/log.png',
      order_id: order_id,
      modal: {
        escape: false,
      },
      theme: {
        color: '#0c238a',
      },
    };

    options.handler = (response: any, error: any) => {
      const subtotal = this.subtotal(this.courseDetails.price, 5);
      const paymentData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        course_id: this.courseDetails._id,
        receiver_id: this.courseDetails.user_id._id,
        amount: subtotal,
      };

      options.response = response;

      this._paymentService
        .verifyPayment(paymentData)
        .pipe(takeUntil(this._ngUnsubscribe$))
        .subscribe((res) => {
          if (res.success) {
            this.closeModal();
            this._toaster.toasterFunction(res);
            this._modalService.openNestedModal();
          }
        });
    };

    const rzp = new this._windRef.nativeWindow.Razorpay(options);

    rzp.open();
  }

  closeModal() {
    this.modalClosed.emit();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
