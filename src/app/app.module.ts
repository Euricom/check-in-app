import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Configuration } from 'msal';
import {
  MsalService,
  MsalModule,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalAngularConfiguration,
  MsalInterceptor,
} from '@azure/msal-angular';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/beta/', ['user.read']],
];

function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: environment.clientId,
      authority: environment.authority,
      validateAuthority: true,
      redirectUri: environment.redirectUrl,
      postLogoutRedirectUri: environment.redirectUrl,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      storeAuthStateInCookie: false,
    },
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: false,
    protectedResourceMap,
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MsalModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MSAL_CONFIG, useFactory: MSALConfigFactory },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory,
    },
    MsalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
