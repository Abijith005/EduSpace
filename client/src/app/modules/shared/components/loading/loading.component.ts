import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SharedState } from '../../../../store/shared/shared.state';
import { selectIsLoading } from '../../../../store/shared/shared.selector';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
    private _store: Store<SharedState>,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this._store.select(selectIsLoading);
  }

  ngOnInit(): void {
    this.isLoading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
