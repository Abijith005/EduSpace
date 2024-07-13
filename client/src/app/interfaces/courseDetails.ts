
interface FileDetails {
  url: string;
  key: string;
}

export interface ICourseDetails {
  _id: string;
  user_id: string;
  category_id: string;
  title: string;
  price: number;
  about: string;
  previewImage: FileDetails[];
  previewVideo: FileDetails[];
  videos: FileDetails[];
  notes: FileDetails[];
  rating: number;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}