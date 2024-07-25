import { Injectable } from '@angular/core';
import { ICourseDetails } from '../../interfaces/courseDetails';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor() {}

  private courseData!: ICourseDetails;

  setCourseData(data: ICourseDetails) {
    this.courseData = data;
  }

  getCourseData() {
    return this.courseData;
  }
}
