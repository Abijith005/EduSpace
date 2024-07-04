import { createAction, props } from '@ngrx/store';
import { IuserInformation } from '../../interfaces/userInformation';

export const userLogin = createAction(
  '[auth] user login',
  props<{ userDatas: IuserInformation }>()
);
export const resetPasswordOtp = createAction(
  '[auth] user OTP',
  props<{ email: string }>()
);
export const userLogOut = createAction('[auth] user logout');
export const checkAuthStatusSuccess = createAction(
  '[auth] check auth status success',
  props<{ userDatas: IuserInformation }>()
);

export const checkAuthStatusFailure=createAction('[auth] check auth failure')