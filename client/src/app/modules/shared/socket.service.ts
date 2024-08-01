import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environments } from '../../../environments/environments';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Imessage } from '../../interfaces/messageData';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  serverUrl = environments.chatServiceUrl;
  private messages$ = new BehaviorSubject<{
    message: string;
    senderId: string;
    senderName: string;
    communityId: string;
    createdAt:Date
  } | null>(null);
  private _socket: Socket;

  constructor() {
    this._socket = io(this.serverUrl);
    this._socket.on('receiveMessage', (data) => {
      this.messages$.next(data);
    });
  }

  online(user_id: string) {
    this._socket.emit('online', user_id);
  }

  sendMessage(
    message: string,
    userId: string,
    userName: string,
    communityId: string
  ) {
    this._socket.emit('sendMessage', {
      message,
      userId,
      userName,
      communityId,
    });
  }

  getMessages(): Observable<Imessage> {
    return this.messages$
      .asObservable()
      .pipe(filter((msg) => msg != null)) as Observable<Imessage>;
  }

  offline(user_id: string) {
    this._socket.emit('offline', user_id);
  }

  ngOnDestroy(): void {
    this._socket.disconnect();
  }
}
