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
  user: User;
  subscriptions: Array<string>;

  ngOnInit() {
    this.populateList();
    this.getUser();
  }

  async getUser() {
    this.user = await this.authService.getUser();
    console.log(this.user);
  }

  populateList(): void {
    this.eventService.getAll().subscribe((res) => {
      this.events = res;
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
