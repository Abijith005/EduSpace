import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

function getWidow() {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowRefService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return getWidow();
    }

  }
}
