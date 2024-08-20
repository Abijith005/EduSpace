import { createAction, props } from '@ngrx/store';
import { IuserInformation } from '../../interfaces/userInformation';
interface updatedUserInfo {
  profilePic?: { key: string; url: string };
  name?: string;
}

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

export const infoUpdate = createAction(
  '[user] update user info',
  props<{ updatedData: updatedUserInfo }>()
);

export const checkAuthStatusFailure = createAction('[auth] check auth failure');
