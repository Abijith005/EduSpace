import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcommunityMemberData } from '../../interfaces/communityData';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _http: HttpClient) {}

  getAllCommunities(){
    return this._http.get<IgenreralResponse&{memberDetails:IcommunityMemberData}>(`/v1/chat/communities/all`)
  }
}
