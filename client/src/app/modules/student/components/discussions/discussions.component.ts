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
// import { IcommunityMemberData } from '../../../../interfaces/communityData';
import { SocketService } from '../../../shared/socket.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserAuthState } from '../../../../store/auth/auth.selector';
import { Imessage } from '../../../../interfaces/messageData';
import {
  ICommunityData,
  ICommunityMemberData,
} from '../../../../interfaces/communityData';

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
  communityData: ICommunityMemberData[] | null = null;
  userId!: string;
  userName!: string;
  selectedCommunity: ICommunityMemberData | null = null;
  page = 1;
  limit = 20;
  firstUnreadMessageId: string | null = null;
  messageList = new Map<
    string,
    {
      _id?: string;
      senderId: string;
      senderName: string;
      message: string;
      createdAt: Date;
    }[]
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
        this.communityData = res.communities;
        console.log(this.communityData,'this is community datassssss\n\n\n\n\n\n');
        
      });

    this._store
      .select(selectUserAuthState)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.userId = res.userData._id!;
        this.userName = res.userData.name;
      });

    this._socketService.online(this.userId);
    this._socketService
      .getMessages()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((data) => {
        if (data) {
          const { message, communityId, senderId, senderName, createdAt } =
            data;

          const messageCommunity = this.communityData?.find(
            (e) => e.communityId._id == communityId
          );

          if (messageCommunity) {
            if (messageCommunity.messages) {
              messageCommunity.messages.message = message;
            } else {
              messageCommunity.messages = {
                message,
                createdAt,
              } as Imessage;
            }

            if (communityId != this.selectedCommunity?.communityId._id) {
              messageCommunity!.unreadCount++ || 1;
            }
            const communityIndex = this.communityData?.indexOf(
              messageCommunity!
            );
            const [removedCommunity] = this.communityData!.splice(
              communityIndex!,
              1
            );
            this.communityData?.unshift(removedCommunity);
          }

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

  selectCommunity(community: ICommunityMemberData) {
    if (this.selectedCommunity == community) {
      return;
    }
    community.unreadCount = 0;

    this.page = 1;
    this.selectedCommunity = community;
    this._chatService
      .getCommunityMessages(community.communityId._id, this.page, this.limit)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.messages) {
          this.firstUnreadMessageId = res.messages.find(
            (message) => !message.readBy.includes(this.userId)
          )?._id!;

          this.messageList.set(community.communityId._id, res.messages);

          setTimeout(() => this.scrollToFirstUnread(), 0);

          const unreadMessageIds: string[] = [];
          res.messages.forEach((message) => {
            if (!message.readBy.includes(this.userId)) {
              unreadMessageIds.push(message._id);
            }
          });
          if (unreadMessageIds.length > 0) {
            this._chatService
              .updateMessageRead(unreadMessageIds, this.userId)
              .pipe(takeUntil(this._ngUnsubscribe$))
              .subscribe((res) => {});
          }
        }
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
      this.selectedCommunity?.communityId._id!
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
      ++this.page;
      this._chatService
        .getCommunityMessages(
          this.selectedCommunity?.communityId._id!,
          this.page,
          this.limit
        )
        .pipe(takeUntil(this._ngUnsubscribe$))
        .subscribe((res) => {
          const existingMessages =
            this.messageList.get(this.selectedCommunity?.communityId._id!) ||
            [];
          this.messageList.set(this.selectedCommunity?.communityId._id!, [
            ...res.messages,
            ...existingMessages,
          ]);
        });
    }
  }

  scrollToFirstUnread() {
    if (this.firstUnreadMessageId) {
      const container = this.chatContainer.nativeElement;
      const messages = Array.from(
        container.querySelectorAll('.message')
      ) as HTMLElement[];

      const firstUnread = messages.find((el: HTMLElement) => {
        return (
          el.getAttribute('data-message-id') ===
          this.firstUnreadMessageId?.toString()
        );
      });

      if (firstUnread) {
        const offsetTop = firstUnread.offsetTop;
        const containerHeight = container.clientHeight;
        const scrollTop =
          offsetTop - containerHeight + firstUnread.clientHeight;

        container.scrollTo({ top: scrollTop });
      }
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
