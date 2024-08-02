export interface Imessage {
  _id: string;
  senderId: string;
  senderName: string;
  communityId: string;
  message: string;
  readBy: string[];
  createdAt: Date;
}
