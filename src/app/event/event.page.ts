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
  checkedInUsers: Array<User>;
  users: Array<User>;

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
      this.getUsers();
      this.getCheckedInUsers();
      this.checkedIn = this.getCheckedInUsers().length;
      this.subscribed = this.getUsers().length;
    });
  }

  showSubscribed(e) {
    this.subscribedVisibility = e;
  }

  getUsers(): Array<User> {
    if (this.item && this.item.users[0].id) {
      return (this.users = this.item.users);
    }
    return [];
  }

  getCheckedInUsers(): Array<User> {
    if (this.item && this.item.users) {
      return (this.checkedInUsers = this.item.users.filter((user) => {
        return user.checkedIn === true;
      }));
    }
    return [];
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
