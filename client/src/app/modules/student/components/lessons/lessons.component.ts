import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { setLoading } from '../../../../store/shared/shared.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
})
export class LessonsComponent implements OnInit {
  videos!: { key: string; url: string }[];
  selectedVideo: { url: string; key: string } | null = null;
  isChatVisible = false;


  constructor(
    private _sharedDataService: SharedDataService,
    private _store: Store
  ) {}

  ngOnInit(): void {
    this.videos = this._sharedDataService.getCourseData().videos;
  }

  changeVideo(video: { key: string; url: string }) {
    this._store.dispatch(setLoading({ isLoading: true }));

    this.selectedVideo = video;
    setTimeout(() => {
      this._store.dispatch(setLoading({ isLoading: false }));
    }, 1000);
  }

  isSelected(video: any) {
    console.log(this.selectedVideo?.url === video.url);
    
    return this.selectedVideo?.url === video.url;
  }


  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }


}
