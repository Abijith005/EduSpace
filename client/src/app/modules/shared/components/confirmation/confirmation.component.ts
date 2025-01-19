import { Component, EventEmitter,  Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
  }
  
  onCancel() {
    this.confirmed.emit(false);
  }
}
