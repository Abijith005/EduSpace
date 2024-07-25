import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private _http: HttpClient) {}

  createOrder(price: number) {
    console.log('called create order');

    return this._http.post(`/v1/payment/paypal/createOrder`, { price });
  }

  captureOrder(orderID: number) {
    return this._http.post(`/v1/payment/paypal/executePayment`, { orderID });
  }

  createRazorpayOrder(price: number) {
    return this._http.post(`/v1/payment/razorpay/createOrder`, { price });
  }

  verifyPayment(data:any){
    return this._http.post<IgenreralResponse>('/v1/payment/razorpay/verifyPayment',data)
  }
}
