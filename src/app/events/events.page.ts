import { EventService } from './../services/event.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  events = this.eventService.getAll();

  ngOnInit() {}

  goDetail(): void {
    this.router.navigate(['event']);
  }
}
