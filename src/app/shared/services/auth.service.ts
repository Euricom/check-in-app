import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MsalService } from '@azure/msal-angular';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated: boolean;
  public user: User;

  constructor(
    private msalService: MsalService,
    private userService: UserService
  ) {
    this.authenticated = this.msalService.getAccount() != null;
  }

  signOut() {
    this.msalService.logout();
    this.authenticated = false;
    this.user = null;
  }

  async getAccessToken(): Promise<any> {
    const result = await this.msalService
      .acquireTokenSilent({ scopes: ['user.read'] })
      .catch((error) => {
        console.log('Get token failed', JSON.stringify(error));
      });
    return result;
  }

  async getOrCreateUser() {
    if (!this.authenticated) {
      return null;
    }

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

    let result: User = await this.userService.getById(graphUser.id).toPromise();

    // Add user to db if not exists
    if (Object.keys(result).length === 0) {
      const user = new User({
        _id: graphUser.id,
        firstName: graphUser.givenName,
        lastName: graphUser.surname,
        email: graphUser.mail,
        phoneNumber: graphUser.mobilePhone,
        subscribed: [],
        role: '',
      });
      result = await this.userService.create(user).toPromise();
    }

    this.user = result;
    return result;
  }
}
