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
import { SocketService } from '../../../shared/socket.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserAuthState } from '../../../../store/auth/auth.selector';

interface IcommunityData {
  _id: string;
  title: string;
  course_id: string;
}

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrl: './discussions.component.css',
})
export class DiscussionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageBox') messageBox!: ElementRef;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  message: string = '';
  communityData: IcommunityMemberData | null = null;
  userId!: string;
  userName!: string;
  selectedCommunity: IcommunityData | null = null;
  page = 1;
  limit = 8;
  messageList = new Map<
    string,
    { senderId: string; senderName: string; message: string; createdAt: Date }[]
  >();

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _chatService: ChatService,
    private _socketService: SocketService,
    private _store: Store<{ user: AuthState }>
  ) {}

  ngOnInit(): void {
    this._chatService
      .getAllCommunities()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.communityData = res.memberDetails;
      });

    this._store
      .select(selectUserAuthState)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.userId = res.userData._id!;
        this.userName = res.userData.name;
      });

    this._socketService
      .getMessages()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((data) => {
        if (data) {
          const { message, communityId, senderId, senderName, createdAt } =
            data;
          if (!this.messageList.has(communityId)) {
            this.messageList.set(communityId, []);
          }
          const community = this.messageList.get(communityId)!;
          community.push({ senderId, senderName, message, createdAt });
        }
      });
  }

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

  selectCommunity(community: IcommunityData) {
    if (this.selectedCommunity == community) {
      return;
    }
    this.page = 1;
    this.selectedCommunity = community;
    this.getCommunityMessages(community._id);
  }

  getCommunityMessages(communityId: string) {
    this._chatService
      .getCommunityMessages(communityId, this.page, this.limit)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.messageList.set(communityId, res.messages);
      });
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    const msg = this.message.trim();
    if (!msg) {
      return;
    }

    this._socketService.sendMessage(
      msg,
      this.userId,
      this.userName,
      this.selectedCommunity?._id!
    );
    this.messageBox.nativeElement.style.height = 'auto';
    this.message = '';
    this.messageBox.nativeElement.focus();
  }

  onScroll(): void {
    const chatContainer = this.chatContainer.nativeElement;
    const scrollTop = chatContainer.scrollTop;
    const scrollHeight = chatContainer.scrollHeight;
    const clientHeight = chatContainer.clientHeight;

    if (scrollHeight - Math.abs(scrollTop) <= clientHeight) {
      const previousScrollHeight = scrollHeight;

      ++this.page;
      this._chatService
        .getCommunityMessages(
          this.selectedCommunity?._id!,
          this.page,
          this.limit
        )
        .pipe(takeUntil(this._ngUnsubscribe$))
        .subscribe((res) => {
          const existingMessages =
            this.messageList.get(this.selectedCommunity?._id!) || [];
          this.messageList.set(this.selectedCommunity?._id!, [
            ...res.messages,
            ...existingMessages,
          ]);
          const newScrollHeight = chatContainer.scrollHeight;
          chatContainer.scrollTop =
            scrollTop + (newScrollHeight - previousScrollHeight);
        });
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
