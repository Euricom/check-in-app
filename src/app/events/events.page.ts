import { EventService } from './../shared/services/event.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  events = Array<Event>();

  ngOnInit() {
    this.populateList();
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

  createEvent() {
    this.router.navigateByUrl('/events/new');
    this.populateList();
  }
}
