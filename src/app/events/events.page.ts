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

  events = [];

  ngOnInit() {
    this.populateList();
  }

  populateList(): void {
    this.eventService.getAll().subscribe((res) => {
      console.log(res.items);
      this.events = res.items;
    });
  }

  goDetail(id): void {
    this.router.navigate(['event', id]);
  }

  onDelete(id): void {
    console.log('delete ' + id);
    this.eventService.delete(id);
    this.populateList();
  }

  createEvent() {
    this.eventService.create();
    this.populateList();
  }
}
