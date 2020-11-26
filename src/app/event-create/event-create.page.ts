import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from './../shared/services/event.service';
import { Event } from '../shared/models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {
  form: FormGroup;
  title = 'New Event';
  routeId: number;
  item: Event;
  editMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  async ngOnInit() {
    this.routeId = +this.route.snapshot.paramMap.get('id');
    this.initFrom();

    if (this.routeId !== 0) {
      this.editMode = true;
      this.title = `Edit Event ${this.item ? ':' + this.item.name : ''}`;
      this.getEvent(this.routeId);
    }
  }

  initFrom(): void {
    this.form = this.formBuilder.group({
      name: [this.item ? this.item.name : '', Validators.required],
      startDate: [this.item ? this.item.startDate : ''],
      endDate: [this.item ? this.item.endDate : ''],
    });
  }

  async getEvent(id) {
    await this.eventService.getById(id).subscribe((result) => {
      this.item = new Event(result);
      this.initFrom();
    });
  }

  createEvent(): void {
    if (!this.form.valid) {
      return;
    }
    const newEvent = this.form.value;

    if (!this.editMode) {
      this.eventService.create(newEvent).subscribe(() => {
        this.eventService.onNovigateToOverview();
        this.router.navigateByUrl(`/events`);
      });
    }

    if (this.editMode) {
      this.eventService
        .update(this.routeId, {
          option: 'updateEvent',
          item: this.form.value,
        })
        .subscribe(() => {
          this.eventService.onNovigateToOverview();
          this.router.navigateByUrl(`/events`);
        });
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(`/events`);
  }
}
