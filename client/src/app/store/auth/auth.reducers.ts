import { createReducer, on } from '@ngrx/store';
import {
  checkAuthStatusFailure,
  checkAuthStatusSuccess,
  infoUpdate,
  resetPasswordOtp,
  userLogOut,
  userLogin,
} from './auth.actions';
import { AuthState } from './auth.state';

export const initialState: AuthState = {
  userData: {
    _id: '',
    name: '',
    email: '',
    profilePic: { key: '', url: '' },
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
  }),
  on(infoUpdate, (state, { updatedData }) => {
    console.log('reducer calledddddddddddddd,updateddata',updatedData);
    
    const a= {
      ...state,
      userData: {
        ...state.userData,
        ...updatedData,
      },
    };
console.log('updated value',a);

    return a
  })
);
