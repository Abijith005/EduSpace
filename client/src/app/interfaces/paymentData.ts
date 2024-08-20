import { IuserInformation } from './userInformation';

export interface IpaymentDatas {
  _id: string;
  type: string;
  courseId: string;
  amount: number;
  courseDetails: { _id: string; title: string };
  createdAt: string;
  updatedAt: string;
  sender: IuserInformation;
  receiver: IuserInformation;
  transactionId: string;
}
