import { createReducer, on } from '@ngrx/store';
import { SharedState } from './shared.state';
import { setLoading } from './shared.actions';

export const initialState: SharedState = {
  isLoading: false,
};
export const sharedReducer = createReducer(
  initialState,
  on(setLoading, (state, { isLoading }) => {
    return {
      ...state,
      isLoading,
    };
  })
);
