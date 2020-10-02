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
  item = {
    name: 'Event',
  };
  users = [];
  checkedInUsers = [];
  checkedIn = 0;
  subscribed = 0;
  subscribedVisibility = true;

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
      this.item = res.item;
      console.log(res);

      // if (res.users && res.users.length !== 0) {
      //   this.getEventUsers(res.users);
      //   this.subscribed = res.users.length;
      // }
    });
  }

  showSubscribed(e) {
    this.subscribedVisibility = e;
  }

  // TODO remove once API returns complete event w users
  getEventUsers(users): void {
    users.forEach((user) => {
      this.userService.getById(user.id).subscribe((res) => {
        this.users.push({ ...res, checkedIn: user.checkedIn });
        this.checkedInUsers = this.users.filter((u) => {
          return u.checkedIn === true;
        });
        this.checkedIn = this.checkedInUsers.length;
      });
    });
  }
}
