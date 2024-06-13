import { createAction, props } from '@ngrx/store';
import { IuserInformation } from '../interfaces/interfaces';

export const userLogin = createAction('[data] user login',props<{userDatas:IuserInformation}>());
export const resetPasswordOtp=createAction('[data] user OTP',props<{email:string}>())
export const userLogOut = createAction('[data] user log out');
