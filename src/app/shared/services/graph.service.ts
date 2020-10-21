import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  constructor(private http: HttpClient, private authService: AuthService) {
    // this.graphClient = Client.init({
    //   authProvider: async (done) => {
    //     const token = await this.authService.getAccessToken().catch((error) => {
    //       done(error, null);
    //     });
    //     if (token) {
    //     }
    //   },
    // });
  }
}
