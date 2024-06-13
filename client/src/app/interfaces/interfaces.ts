export interface IuserLogin {
  email: string;
  password: string;
  role: string;
}

export interface IgenreralResponse {
  success: boolean;
  message: string;
}

export interface IuserRegisterData {
  name: string;
  email: string;
  password: string;
  profilePic?:string
}

export interface IuserInformation {
  email: string;
  name: string;
  profilePic: string;
}
