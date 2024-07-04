import { createAction, props } from '@ngrx/store';

export const setLoading = createAction(
  '[ui loading] check loading page',
  props<{ isLoading: boolean }>()
);
