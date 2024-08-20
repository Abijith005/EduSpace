import { IuserInformation } from './userInformation';

export interface IwithdrawRequest {
  _id: string;
  accountNumber: number;
  accountHolder: string;
  ifsc: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  actionDate:string
  user: IuserInformation;
}
