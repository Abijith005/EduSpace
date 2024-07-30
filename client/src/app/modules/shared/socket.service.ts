import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy{
  serverUrl = environments.chatServiceUrl;
  private _socket: Socket;
  constructor() {
    this._socket = io(this.serverUrl);

    // window.addEventListener('beforeunload', () => {
    //   this._socket.emit('disconnect');
    // });
  }

  online(user_id:number) {
    
    this._socket.emit('online',user_id);
  }

  sendMessage() {
    console.log('sending messages');
  }


  ngOnDestroy(): void {
    this._socket.emit('disconnect');
    this._socket.disconnect(); // Properly close the socket connection
  }
}
