import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../shared/chat.service';
import { Subject, takeUntil } from 'rxjs';
import { IcommunityMemberData } from '../../../../interfaces/communityData';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrl: './discussions.component.css',
})
export class DiscussionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageBox') messageBox!: ElementRef;

  communityData: IcommunityMemberData | null = null;

  private _ngUnsubscribe$ = new Subject<void>();

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this._chatService
      .getAllCommunities()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.communityData = res.memberDetails;
      });
  }

  message: string = '';

  ngAfterViewInit() {
    if (this.communityData) {
      this.adjustTextareaHeight();
    }
  }

  adjustTextareaHeight(event?: Event): void {
    const textarea = this.messageBox.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
