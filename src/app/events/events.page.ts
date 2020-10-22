import { UserService } from './../shared/services/user.service';
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
    private authService: AuthService,
    private userSevice: UserService
  ) {}

  events = Array<Event>();
  events2 = Array<Event>();
  user: User;

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.user = new User(await this.authService.getUser());
    this.getEvents();
  }

  getEvents() {
    this.eventService
      .getAll(this.user ? this.user._id : '-')
      .subscribe((res) => {
        this.events = res;
      });
  }

  goDetail(id): void {
    this.router.navigate(['event', id]);
  }

  onDelete(id): void {
    this.eventService.delete(id);
    this.getEvents();
  }

  createEvent(): void {
    this.router.navigateByUrl('/events/new');
  }

  onCheckEvent(item) {
    item.subscribed = !item.subscribed;
    this.userSevice.udateUserEvent(this.user._id, item);
  }
}
