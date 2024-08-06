export interface IinstructorDetails {
  _id: string;
  name: string;
  email: string;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
  categories: {_id:string,title:string}[];
  totalCourses: number;
  rating: number;
}
