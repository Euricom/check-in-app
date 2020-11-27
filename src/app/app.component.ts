import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    public toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.presentToast(() => {
          window.location.reload();
        });
      });
    }
  }

  async presentToast(handler) {
    const toast = await this.toastController.create({
      message: 'A new version is Available.',
      buttons: [
        {
          side: 'end',
          text: 'Get Lastest',
          role: 'cancel',
          handler,
        },
      ],
    });
    toast.present();
  }
}
