import { environment } from 'src/environments/environment';
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
  public authenticated = true;
  public isAdmin = false;
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private msalService: MsalService,
    private userService: UserService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
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

  getGraphClient(): Client {
    return Client.init({
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
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async getOrCreateUser() {
    const graphClient = this.getGraphClient();
    const graphUser = await graphClient.api('/me').get();

    let authUser: User = await this.userService
      .getById(graphUser.id)
      .toPromise();

    const members = await this.getADGroupMembers();
    const users = await this.userService.getAll().toPromise();

    const isMember = members.find((user) => user._id === graphUser.id);
    const isUser = users.find((user) => user._id === graphUser.id);

    if (!isMember) {
      this.authenticated = false;
      return;
    }

    if (!isUser) {
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
    }

    if (authUser.role === 'Admin') {
      this.isAdmin = true;
    }

    this.authenticated = true;
    localStorage.setItem('currentUser', JSON.stringify(authUser._id));
    this.currentUserSubject.next(authUser);
    return authUser;
  }

  async syncADGroupMembers(): Promise<void> {
    const members = await this.getADGroupMembers();
    this.userService.syncUsers(members).subscribe();
  }

  async getADGroupMembers(): Promise<User[]> {
    const graphClient = this.getGraphClient();
    const members = await graphClient
      .api(`/groups/${environment.AdGroupId}/members`)
      .get();

    if (!members.value.length) {
      return [];
    }

    const ADMemebers = members.value.map(
      (item) =>
        new User({
          _id: item.id,
          firstName: item.givenName,
          lastName: item.surname,
          email: item.mail,
          phoneNumber: item.mobilePhone,
          subscribed: [],
          role: '',
        })
    );

    return ADMemebers;
  }
}
