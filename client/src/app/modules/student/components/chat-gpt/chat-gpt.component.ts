import { Component, OnDestroy } from '@angular/core';
import { OpenAIService } from '../../open-ai.service';
import { Subject, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrl: './chat-gpt.component.css',
})
export class ChatGptComponent implements OnDestroy {
  messageInput: string = '';
  chats: { message: string; type: string }[] = [];
  textareaHeight: number = 41;
  isLoading$ = of(false);

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(private _openAiService: OpenAIService) {}

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    this.textareaHeight = Math.min(textarea.scrollHeight, 80);
  }

  sendMessage(): void {
    const message = this.messageInput.trim();
    if (message) {
      this.chats.unshift({ message: message, type: 'send' });
      this.messageInput = '';
      this.textareaHeight = 41;
      this.isLoading$ = of(true);
      this._openAiService
        .createPrompt(message)
        .pipe(takeUntil(this._ngUnsubscribe$))
        .subscribe((res) => {
          this.isLoading$ = of(false);
          this.chats.unshift({
            message: res.chatCompletion,
            type: 'received',
          });
        });
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
