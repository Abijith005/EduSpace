import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-smaple',
  templateUrl: './smaple.component.html',
  styleUrl: './smaple.component.css',
})
export class SmapleComponent implements AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  // Example data
  messageList: string[] = Array.from({ length: 20 }, (_, i) => String.fromCharCode(97 + i));
  firstUnreadIndex: string = 'm'; // Assuming index 14 (15) is the first unread message

  ngAfterViewInit() {
    this.scrollToFirstUnread();
  }

  scrollToFirstUnread() {
    const container = this.chatContainer.nativeElement;
    const messages = Array.from(
      container.querySelectorAll('.message')
    ) as HTMLElement[];

    // Find the first unread message
    const firstUnread = messages.find(
      (el: HTMLElement) =>
        el.textContent?.trim() === this.firstUnreadIndex
    );

    if (firstUnread) {
      // Calculate the position to scroll to
      const offsetTop = firstUnread.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollTop = offsetTop - containerHeight + firstUnread.clientHeight;

      // Adjust scroll position
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }
}
