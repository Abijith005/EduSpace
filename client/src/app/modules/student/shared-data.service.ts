import { Injectable } from '@angular/core';
import { IcourseDetails } from '../../interfaces/courseDetails';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor() {}

  private courseData!: IcourseDetails;

  setCourseData(data: IcourseDetails) {
    this.courseData = data;
  }

  getCourseData() {
    return this.courseData;
  }
}
