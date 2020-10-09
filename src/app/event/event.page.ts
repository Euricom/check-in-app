import { EventService } from './../shared/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: number;
  item: Event;
  checkedIn = 0;
  subscribed = 0;
  subscribedVisibility = true;
  users: Array<User>;
  visibleUsers: Array<User>;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((result) => {
      this.getEvent(result.id);
    });
  }

  getEvent(id): void {
    this.eventService.getById(id).subscribe((result) => {
      console.log(result);
      this.item = new Event(result);
      this.users = this.getUsers();
      this.visibleUsers = this.getCheckedInUsers();
      this.checkedIn = this.getCheckedInUsers().length;
      this.subscribed = this.getSubscribedUsers().length;
    });
  }

  setVisible(e) {
    this.subscribedVisibility = e;
    if (e) {
      this.visibleUsers = this.getCheckedInUsers();
    }
    if (!e) {
      this.visibleUsers = this.getSubscribedUsers();
    }
  }

  getUsers() {
    if (this.item) {
      return this.item.users.filter((user) => Object.keys(user).length !== 0);
    }
    return [];
  }

  getCheckedInUsers(): Array<User> {
    return this.filterUsers(this.users, (user) => user.checkedIn === true);
  }

  getSubscribedUsers(): Array<User> {
    return this.filterUsers(this.users, (user) => user.checkedIn === false);
  }

  filterUsers(users, filter) {
    if (users) {
      return users.filter(filter);
    }
    return [];
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
