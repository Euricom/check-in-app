import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MsalService } from './../msal';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated: boolean;
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private msalService: MsalService,
    private userService: UserService
  ) {
    // TODO do check for authentication
    // this.authenticated = this.msalService.getAccount() != null;
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();

    console.log('init authService');
  }

  signOut() {
    this.msalService.logout();
    this.authenticated = false;
    this.currentUser = null;
  }

  async getAccessToken(): Promise<any> {
    const authResponse = this.msalService
      .acquireTokenSilent({
        scopes: ['user.read'],
        account: {
          homeAccountId: '',
          environment: '',
          tenantId: '',
          username: '',
        },
      })
      .toPromise()
      .catch((error) => {
        console.log('Get token failed', JSON.stringify(error));
      });

    return authResponse;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async getOrCreateUser() {
    // if (!this.authenticated) {
    //   return null;
    // }

    console.log('did this');

    const graphClient = Client.init({
      // Init graph client
      authProvider: async (done) => {
        const token = await this.getAccessToken().catch((error) => {
          done(error, null);
        });
        if (token) {
          done(null, token.accessToken);
        } else {
          done('Could not get access token', null);
        }
      },
    });

    const graphUser = await graphClient.api('/me').get();

    let authUser: User = await this.userService
      .getById(graphUser.id)
      .toPromise();

    // Add user to db if not exists
    if (Object.keys(authUser).length === 0) {
      const user = new User({
        _id: graphUser.id,
        firstName: graphUser.givenName,
        lastName: graphUser.surname,
        email: graphUser.mail,
        phoneNumber: graphUser.mobilePhone,
        subscribed: [],
        role: '',
      });
      authUser = await this.userService.create(user).toPromise();
    }

    localStorage.setItem('currentUser', JSON.stringify(authUser));
    this.currentUserSubject.next(authUser);
    return authUser;
  }
}
