import { Imessage } from './messageData';

// export interface IcommunityMemberData {
//   _id: string;
//   title: string;
//   course_id: string;
//   unreadCount: number;
//   messages: Imessage;
// }

// interface communityData {
//   _id: string;
//   title: string;
//   course_id: string;
// }


export interface ICommunityData {
  _id: string;
  title: string;
  course_id: string;
  totalMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunityMemberData {
  _id: string;
  communityId: ICommunityData; 
  joinedAt: Date; 
  messages: Imessage;
  unreadCount: number; // Number of unread messages
}