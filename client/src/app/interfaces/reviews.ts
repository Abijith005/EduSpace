import { IuserInformation } from './userInformation';

export interface Ireview {
  _id: string;
  courseId: string;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  subscriber: IuserInformation;
}
