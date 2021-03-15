import { UserListComponent } from './../components/user-list/user-list.component';
import { AuthService } from './../shared/services/auth.service';
import { PopOverListComponent } from './../components/pop-over-list/pop-over-list.component';
import { EventService } from './../shared/services/event.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../shared/services/user.service';
import {
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = new Array<Subscription>();
  item: Event;
  checkedInCount = 0;
  subscribedCount = 0;
  subscribedVisibility = true;
  users: Array<User>;
  searchText = '';
  currentUser: User;
  isAdmin = false;
  loading = true;
  popOverOptions = [
    { title: 'Add Users', action: 'addUsers' },
    { title: 'Unsubscribe All', action: 'unSubAll' },
    { title: 'Checkout All', action: 'checkOutAll' },
  ];
  userAddOptions = [{}];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userSevice: UserService,
    private authService: AuthService,
    public popoverController: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController
  ) {
    const sub = this.authService.currentUser.subscribe(
      (result) => (this.currentUser = result)
    );

    this.subscriptions.push(sub);
  }

  ngOnInit() {
    this.loading = true;
    const sub = this.route.params.subscribe((result) => {
      this.getEvent(result.id);
    });

    if (this.currentUser && this.currentUser.role === 'Admin') {
      this.isAdmin = true;
    }

    this.subscriptions.push(sub);
  }

  getEvent(id) {
    return this.eventService.getById(id).subscribe((result) => {
      this.item = new Event(result);
      this.users = this.sortUsers(this.item.users);
      this.getUserCounts(this.users);
      this.loading = false;
    });
  }

  setUserVisiblilty({ checkedIn }) {
    return this.subscribedVisibility ? !checkedIn : checkedIn;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopOverListComponent,
      event: ev,
      componentProps: {
        listItems: this.popOverOptions,
      },
    });
    await popover.present();
    return await popover.onDidDismiss().then((data: any) => {
      if (data) {
        if (data.data === 'unSubAll') {
          this.presentAlert(
            'Unsubscribe All',
            'Do you really want to unsubscribe all? This is not reversable.',
            () => {
              this.unSubscribeAll(this.item.eventId);
            }
          );
        }
        if (data.data === 'checkOutAll') {
          this.presentAlert(
            'Checkout All',
            'Do you really want to checkout all? This is not reversable.',
            () => {
              this.checkOutAll(this.item.eventId);
            }
          );
        }
        if (data.data === 'addUsers') {
          this.presentModal();
        }
      }
    });
  }

  async presentAlert(header, message, okHandler) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: okHandler,
        },
      ],
    });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: UserListComponent,
      componentProps: {
        eventId: this.item.eventId,
      },
    });

    modal.onDidDismiss().then((data) => {
      const usersToAdd = data.data.addedUsers;
      const userIds = [];

      if (usersToAdd.length !== 0) {
        usersToAdd.forEach((user) => userIds.push(user._id));

        this.userSevice
          .subscribeManyToEvent(this.item.eventId, userIds)
          .subscribe();

        usersToAdd.forEach((user) => {
          this.users.push(user);
        });

        this.getUserCounts(this.users);
      }
    });

    return await modal.present();
  }

  sortUsers(users): Array<User> {
    if (!users) {
      return [];
    }

    if (!this.currentUser) {
      return users.filter((user) => Object.keys(user).length !== 0);
    }
    const currentUser = users.filter(
      (user) => this.currentUser._id === user._id
    );

    const otherUsers = users.filter(
      (user) =>
        this.currentUser._id !== user._id && Object.keys(user).length !== 0
    );

    return [...currentUser, ...otherUsers];
  }

  getUserCounts(users): void {
    if (!users) {
      this.checkedInCount = 0;
      this.subscribedCount = 0;
      return;
    }

    this.checkedInCount =
      users.length - users.filter((user) => !user.checkedIn).length;

    this.subscribedCount = users.length - this.checkedInCount;
  }

  createSms(user) {
    const message = `Dag${
      user.firstName ? ' ' + user.firstName : ''
    }, We wachten op je, kan je even bevestigen of je komt?`;
    return this.sanitizer.bypassSecurityTrustUrl(
      `sms:${encodeURIComponent(user.phoneNumber)}&body=${encodeURIComponent(
        message
      )}`
    );
  }

  unSubscribeAll(id) {
    this.eventService.update(id, { option: 'unSubAll' }).subscribe(() => {
      this.users = [];
      this.getUserCounts(this.users);
    });
  }

  checkOutAll(id) {
    this.eventService.update(id, { option: 'checkOutAll' }).subscribe(() => {
      this.users.forEach((user) => (user.checkedIn = false));
      this.getUserCounts(this.users);
    });
  }

  onCheckinClick(user) {
    const item = this.item;
    user.checkedIn = !user.checkedIn;

    this.userSevice
      .updateUser(user._id, {
        item,
        data: { field: 'updateEventCheckedIn', value: user.checkedIn },
      })
      .subscribe(() => {
        this.getUserCounts(this.users);
      });
  }

  onDelete(user) {
    const item = this.item;
    user.subscribed = false;
    this.userSevice
      .updateUser(user._id, {
        item,
        data: { field: 'updateSubscribed' },
      })
      .subscribe(() => {
        this.users = this.users.filter(
          (deletedUser) => user._id !== deletedUser._id
        );
        this.getUserCounts(this.users);
      });
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
    this.eventService.onNovigateToOverview();
  }

  doRefresh(e) {
    this.getEvent(this.item.eventId).add(() => {
      e.target.complete();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x: Subscription) => x.unsubscribe());
  }
}
