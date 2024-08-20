export interface IuserInformation {
  _id?: string;
  email: string;
  name: string;
  profilePic: { key: string; url: string };
  role: string;
}
