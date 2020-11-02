import { UserService } from './../shared/services/user.service';
import { AuthService } from './../shared/services/auth.service';
import { EventService } from './../shared/services/event.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  clickEventsubscription: Subscription;
  events = Array<Event>();
  events2 = Array<Event>();
  user: User;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService,
    private userSevice: UserService
  ) {
    this.clickEventsubscription = this.eventService
      .getCreateEvent()
      .subscribe(() => {
        this.getEvents();
      });
  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.user = await this.authService.getOrCreateUser();
    this.getEvents();
  }

  getEvents() {
    return this.eventService
      .getAll(this.user ? this.user._id : '-')
      .subscribe((res) => {
        this.events = res;
      });
  }

  doRefresh(e) {
    this.getEvents().add(() => {
      e.target.complete();
    });
  }

  goDetail(id): void {
    this.router.navigate(['event', id]);
  }

  onDelete(id): void {
    this.eventService.delete(id).subscribe(() => this.getEvents());
  }

  createEvent(): void {
    this.router.navigateByUrl('/events/new');
  }

  onCheckEvent(item) {
    item.subscribed = !item.subscribed;
    this.userSevice
      .updateUser(this.user._id, {
        item,
        data: { field: 'updateSubscribed' },
      })
      .subscribe();
  }
}
