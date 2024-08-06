import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { initFlowbite } from 'flowbite';
import { AuthState } from './store/auth/auth.state';
import { SocketService } from './modules/shared/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';

  constructor(private _store: Store<{ auth: AuthState }>,) {}
  ngOnInit(): void {
    initFlowbite();
  }



  ngOnDestroy(): void {
  }
}
