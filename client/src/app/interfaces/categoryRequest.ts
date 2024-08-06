import { IcategoryData } from "./categoryData";
import { IcategoryResponse } from "./categoryResponse";
import { IuserInformation } from "./userInformation";

export interface Icertificate {
    _id: string;
    key: string;
    url: string;
    verified: boolean;
  }

  
  export interface IcategoryRequest {
    _id: string;
    categoryDetails: IcategoryResponse;
    certificates: Icertificate[];
    status: string;
    userDetails:IuserInformation,
    createdAt: string;
    updatedAt: string;
  }
  