import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-certificate-view',
  templateUrl: './certificate-view.component.html',
  styleUrl: './certificate-view.component.css'
})
export class CertificateViewComponent {
@Output() modalClosed=new EventEmitter()
  closeModal() {
    this.modalClosed.emit();
  }


  certificates = [
    { url: 'url1', key: 'Samantha_B.E Certificate', verified: false },
    { url: 'url2', key: 'Samantha_CA Certificate', verified: false },
    { url: 'url2', key: 'Samantha_CA Certificate', verified: false }
    // Add more certificates as needed
  ];

  verifyCertificate(certificate: any) {
    certificate.verified = true;
  }

  rejectCertificate(certificate: any) {
    certificate.verified = false;
  }

}
