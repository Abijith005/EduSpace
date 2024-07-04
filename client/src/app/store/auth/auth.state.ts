export interface AuthState {
  userData: {
    name: string;
    email: string;
    profilePic: string;
    role:string
  };
  resetPassword:{
    email:string,
    isReset:boolean
  }
  isLoggedIn: boolean;
 
}
