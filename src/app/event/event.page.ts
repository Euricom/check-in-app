import { EventService } from './../shared/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../shared/services/user.service';

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
  visibleUsers: Array<User>;
  searchText = '';
  user: User;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userSevice: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((result) => {
      this.getEvent(result.id);
      this.subscribedVisibility = true;
    });
  }

  getEvent(id) {
    return this.eventService.getById(id).subscribe((result) => {
      this.item = new Event(result);
      this.users = this.getUsers(this.item);
      this.checkedInCount = this.getCheckedInUsers().length;
      this.subscribedCount = this.getSubscribedUsers().length;
    });
  }

  setUserVisiblilty({ checkedIn }) {
    return this.subscribedVisibility ? !checkedIn : checkedIn;
  }

  getUsers(item) {
    if (!item) {
      return [];
    }
    return item.users.filter((user) => Object.keys(user).length !== 0);
  }

  // TODO calculate subbed/checked in by subtracting from total
  getCheckedInUsers(): Array<User> {
    return this.filterUsers(this.users, (user) => user.checkedIn);
  }

  getSubscribedUsers(): Array<User> {
    return this.filterUsers(this.users, (user) => !user.checkedIn);
  }

  filterUsers(users, filter) {
    if (!users) {
      return [];
    }
    return users.filter(filter);
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

  onCheckinClick(user) {
    const item = this.item;
    user.checkedIn = !user.checkedIn;

    this.userSevice
      .updateUser(user._id, {
        item,
        data: { field: 'updateEventCheckedIn', value: user.checkedIn },
      })
      .subscribe(() => {
        this.getEvent(item.eventId);
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
        this.getEvent(item.eventId);
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
