export interface ICertificate {
    _id: string;
    key: string;
    url: string;
    verified: boolean;
  }
  
  export interface ICategoryRequest {
    _id: string;
    userId: string;
    category: string;
    certificates: ICertificate[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  