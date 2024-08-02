import { Imessage } from './messageData';

export interface IcommunityMemberData {
  _id: string;
  title: string;
  course_id: string;
  unreadCount: number;
  messages: Imessage;
}

interface communityData {
  _id: string;
  title: string;
  course_id: string;
}
