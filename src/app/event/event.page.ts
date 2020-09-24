import { UserService } from './../services/user.service';
import { EventService } from './../services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: number;
  event = {
    eventName: 'Event',
  };
  users = [];
  checkedIn = 0;
  subscribed = 0;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.getEvent(res.id);
    });
  }

  getEvent(id): void {
    this.eventService.getById(id).subscribe((res) => {
      this.event = res;
      if (res.users && res.users.length !== 0) {
        this.getEventUsers(res.users);
        this.subscribed = res.users.length;
      }
    });
  }

  // TODO remove once API returns complete event w users
  getEventUsers(users): void {
    users.forEach((user) => {
      this.userService.getById(user.id).subscribe((res) => {
        this.users.push(res);
      });
    });
  }
}
