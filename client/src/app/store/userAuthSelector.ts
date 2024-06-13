import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

// Select the userAuth state slice
export const selectUserAuthState = createFeatureSelector<AppState>('userAuth');

// Select specific properties from the userAuth state
export const selectUserAuth = createSelector(
  selectUserAuthState,
  (state: AppState) => state.userData // Adjust this according to your state structure
);

export const selectUserResetState=createSelector(
  selectUserAuthState,
  (state:AppState)=>state.resetPassword
)
