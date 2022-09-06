import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountModel } from 'src/app/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public token: String;
  public SetUser(_user: any) {
    this.user.next(_user);
  }
  public GetUser(): Observable<any> {
    return this.user.asObservable();
  }

  constructor() { }
  public setToken(token: String) {
    this.token = token;

  }
}
