import { AuthService } from './../shared/services/auth.service';
import { EventService } from './../shared/services/event.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService
  ) {}

  events = Array<Event>();
  events2 = Array<Event>();
  user: User;
  subscriptions;

  ngOnInit() {
    this.populateList();
    this.getUser();
  }

  async getUser() {
    this.user = await this.authService.getUser();
    this.subscriptions = this.user.subscribed;

    // TODO move this to getEvents
    this.subscriptions.forEach((item) => {
      console.log(item);
      this.events.forEach((res) => {
        if (res.eventId === item.id) {
          console.log({ ...res, checkedIn: item.checkedIn });
          this.events2.push(new Event({ ...res, checkedIn: item.checkedIn }));
        } else {
          this.events2.push(new Event({ ...res }));
        }
      });
    });
  }

  populateList(): void {
    this.eventService.getAll().subscribe((res) => {
      this.events = res;
      console.log(this.events);
    });
  }

  goDetail(id): void {
    this.router.navigate(['event', id]);
  }

  onDelete(id): void {
    this.eventService.delete(id);
    this.populateList();
  }

  createEvent(): void {
    this.router.navigateByUrl('/events/new');
  }
}
