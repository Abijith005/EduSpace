import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Select the userAuth state slice
export const selectUserAuthState = createFeatureSelector<AuthState>('userAuth');

export const selectRouteInfo = createSelector(
  selectUserAuthState,
  (state: AuthState) => ({
    userData: state.userData,
    isLoggedIn: state.isLoggedIn,
  })
);

export const selectUserInfo = createSelector(
  selectUserAuthState,
  (state: AuthState) => state.userData
);

export const selectUserLogin = createSelector(
  selectUserAuthState,
  (state: AuthState) => ({isLogin:state.isLoggedIn})
);

export const selectUserResetState = createSelector(
  selectUserAuthState,
  (state: AuthState) => state.resetPassword
);
