import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountModel } from '../models/account.model';
import { Constent } from '../shared/constent';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  public GetUser(): Observable<AccountModel> {
    return this.http.get<AccountModel>(Constent.GetUser);
  }
}
