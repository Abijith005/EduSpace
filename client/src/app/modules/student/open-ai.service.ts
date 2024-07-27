import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IpromptRespose } from '../../interfaces/promptResponse';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  constructor(private _http: HttpClient) {}

  createPrompt(prompt: string) {
    return this._http.post<IgenreralResponse & IpromptRespose>(
      `/v1/student/openAI/prompt`,
      { prompt }
    );
  }
}
