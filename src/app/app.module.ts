import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/app/shared/services/interceptor.service';
import { environment } from 'src/environments/environment';

import {
  MsalService,
  MSAL_INSTANCE,
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
} from './shared/msal';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';

import { MsalInterceptorConfig } from './shared/msal/msal.interceptor.config';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
} from './shared/msal/constants';
import { MsalGuardConfiguration } from './shared/msal/msal.guard.config';
import { ServiceWorkerModule } from '@angular/service-worker';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/beta/', ['user.read']],
];

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: environment.authority,
      redirectUri: environment.redirectUrl,
      postLogoutRedirectUri: environment.redirectUrl,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      storeAuthStateInCookie: false,
    },
  });
}

function MSALInterceptorConfigFactory(): MsalInterceptorConfig {
  // tslint:disable-next-line:no-shadowed-variable
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
    'user.read',
  ]);

  return {
    interactionType: InteractionType.Popup,
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
      } as MsalGuardConfiguration,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
