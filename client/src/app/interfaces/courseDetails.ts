import { IcategoryData } from './categoryData';
import { IuserInformation } from './userInformation';

interface FileDetails {
  url: string;
  key: string;
}

export interface IcourseDetails {
  _id: string;
  user_id: IuserInformation;
  category_id: IcategoryData;
  title: string;
  price: number;
  about: string;
  courseLanguage: string;
  courseLevel: string;
  contents: string[];
  processingStatus: ProcessingStatus;
  previewImage: FileDetails[];
  previewVideo: FileDetails[];
  videos: FileDetails[];
  notes: FileDetails[];
  rating: number;
  activeStatus: boolean;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProcessingStatus {
  Uploading = 'uploading',
  Updating = 'updating',
  Completed = 'completed',
}
