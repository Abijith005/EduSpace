import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { Imessage } from '../../interfaces/messageData';
import { ICommunityMemberData } from '../../interfaces/communityData';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _http: HttpClient) {}

  getAllCommunities() {
    return this._http.get<
      IgenreralResponse & { communities: ICommunityMemberData[] }
    >(`/v1/chat/communities/all`);
  }

  getCommunityMessages(communityId: string, page: number, limit: number) {
    return this._http.get<
      IgenreralResponse & { messages: Omit<Imessage, 'communityId'>[] }
    >(
      `/v1/chat/messages/all?communityId=${communityId}&page=${page}&limit=${limit}`
    );
  }

  updateMessageRead(messageId: string[], userId: string) {
    return this._http.patch<IgenreralResponse>(
      '/v1/chat/messages/messageRead',
      {
        messageId,
        userId,
      }
    );
  }
}
