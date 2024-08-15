export interface AuthState {
  userData: {
    _id?: string;
    name: string;
    email: string;
    profilePic: { key: string; url: string };
    role: string;
  };
  resetPassword: {
    email: string;
    isReset: boolean;
  };
  isLoggedIn: boolean;
}
