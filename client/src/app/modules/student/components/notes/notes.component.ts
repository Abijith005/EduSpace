import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';

interface file {
  key: string;
  url: string;
}
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent {
  notes!: file[];
  selectedCertificate!: string;
  isModalOpen = false;

  constructor(private _sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.notes = this._sharedDataService.getCourseData().notes;
    this.selectedCertificate = this.notes[0].url;
    console.log(this.notes);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  changeCertificate(certificate: file) {
    this.selectedCertificate = certificate.url;
    this.isModalOpen = true;
  }
}
