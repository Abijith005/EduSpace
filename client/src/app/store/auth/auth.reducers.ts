import { createReducer, on } from '@ngrx/store';
import {
  checkAuthStatusFailure,
  checkAuthStatusSuccess,
  resetPasswordOtp,
  userLogOut,
  userLogin,
} from './auth.actions';
import { AuthState } from './auth.state';

export const initialState: AuthState = {
  userData: {
    _id:'',
    name: '',
    email: '',
    profilePic: '',
    role: '',
  },
  resetPassword: {
    email: '',
    isReset: false,
  },
  isLoggedIn: false,
};

export const userAuthReducer = createReducer(
  initialState,
  on(userLogin, (state, { userDatas }) => {    
    return {
      ...state,
      userData: {
        ...userDatas,
      },
      isLoggedIn: true,
    };
  }),
  on(resetPasswordOtp, (state, { email }) => {
    return {
      ...state,
      resetPassword: {
        ...state.resetPassword,
        email: email,
        isReset: true,
      },
    };
  }),
  on(userLogOut, (state) => {
    return initialState;
  }),
  on(checkAuthStatusSuccess, (state, { userDatas }) => {
    return {
      ...state,
      userData: {
        ...userDatas,
      },
      isLoggedIn: true,
    };
  }),
  on(checkAuthStatusFailure, (state) => {
    return initialState;
  })
);
