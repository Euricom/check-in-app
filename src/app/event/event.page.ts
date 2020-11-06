import { AuthService } from './../shared/services/auth.service';
import { PopOverListComponent } from './../components/pop-over-list/pop-over-list.component';
import { EventService } from './../shared/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../shared/services/user.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
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
    { title: 'Unsubscribe all', action: 'unSubAll' },
    { title: 'Check out all', action: 'checkOutAll' },
  ];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userSevice: UserService,
    private authService: AuthService,
    public popoverController: PopoverController
  ) {
    this.authService.currentUser.subscribe(
      (result) => (this.currentUser = result)
    );
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe((result) => {
      this.getEvent(result.id);
    });
    if (this.currentUser && this.currentUser.role === 'Admin') {
      this.isAdmin = true;
    }
  }

  getEvent(id) {
    return this.eventService.getById(id).subscribe((result) => {
      this.item = new Event(result);
      this.users = this.getUsers(this.item);
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
          this.unSubscribeAll(this.item.eventId);
        }
        if (data.data === 'checkOutAll') {
          this.checkOutAll(this.item.eventId);
        }
      }
    });
  }

  getUsers(item): Array<User> {
    if (!item) {
      return [];
    }
    if (!this.currentUser) {
      return item.users.filter((user) => Object.keys(user).length !== 0);
    }
    const currentUser = item.users.filter(
      (user) => this.currentUser._id === user._id
    );
    const otherUsers = item.users.filter(
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
    const message = `Hey${
      user.firstName ? ' ' + user.firstName : ''
    }, We wachten op je voor het Euricom event: ${
      this.item.name
    }, kan je zsm bevestigen dat je komt?`;

    return this.sanitizer.bypassSecurityTrustUrl(
      `sms:${encodeURIComponent(user.phoneNumber)}&body=${encodeURIComponent(
        message
      )}`
    );
  }

  unSubscribeAll(id) {
    this.eventService.update(id, 'unSubAll').subscribe(() => {
      this.users = [];
      this.getUserCounts(this.users);
    });
  }

  checkOutAll(id) {
    this.eventService.update(id, 'checkOutAll').subscribe(() => {
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
  }

  doRefresh(e) {
    this.getEvent(this.item.eventId).add(() => {
      e.target.complete();
    });
  }
}
