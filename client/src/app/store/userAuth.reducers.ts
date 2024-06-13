import { createReducer, on } from '@ngrx/store';
import { resetPasswordOtp, userLogin } from './userAuth.actions';
import { AppState } from './app.state';

export const initialState: AppState = {
  userData: {
    name: '',
    email: '',
    profilePic: '',
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
  })
);
