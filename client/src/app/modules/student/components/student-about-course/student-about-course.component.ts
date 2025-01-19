import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface aboutData {
  contents: string[];
  about: string;
}

@Component({
  selector: 'app-student-about-course',
  templateUrl: './student-about-course.component.html',
  styleUrl: './student-about-course.component.css',
})
export class StudentAboutCourseComponent implements OnInit {
  aboutData!: aboutData;

  ngOnInit(): void {
this.aboutData=history.state.data
  }
}
