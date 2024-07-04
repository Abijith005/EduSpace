import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SharedState } from '../../../../store/shared/shared.state';
import { selectIsLoading } from '../../../../store/shared/shared.selector';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  isLoading$: Observable<boolean>;

  constructor(private store: Store<SharedState>) {
    this.isLoading$ = this.store.select(selectIsLoading);
  }
}
