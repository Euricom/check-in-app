import { EventService } from './../shared/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: number;
  item = { name: '', users: [] };
  checkedIn = 0;
  subscribed = 0;
  subscribedVisibility = true;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.getEvent(res.id);
    });
  }

  getEvent(id): void {
    this.eventService.getById(id).subscribe((res) => {
      this.item = res;
      console.log(res);
    });
  }

  showSubscribed(e) {
    this.subscribedVisibility = e;
  }
}
