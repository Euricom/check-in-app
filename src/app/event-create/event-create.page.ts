import { Router } from '@angular/router';
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
  newEvent = Event;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }

  createEvent(): void {
    if (this.form.valid) {
      this.newEvent = this.form.value;
      this.eventService.create(this.newEvent).subscribe(() => {
        this.eventService.onCreate();
        this.router.navigateByUrl(`/events`);
      });
      return;
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(`/events`);
  }
}
