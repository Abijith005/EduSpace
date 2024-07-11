import { IcategoryData } from "./categoryData";
import { IcategoryResponse } from "./categoryResponse";
import { IuserInformation } from "./userInformation";

export interface ICertificate {
    _id: string;
    key: string;
    url: string;
    verified: boolean;
  }

  
  export interface ICategoryRequest {
    _id: string;
    categoryDetails: IcategoryResponse;
    certificates: ICertificate[];
    status: string;
    userDetails:IuserInformation,
    createdAt: string;
    updatedAt: string;
  }
  