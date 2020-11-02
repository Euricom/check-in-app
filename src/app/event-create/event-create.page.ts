import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from './../shared/services/event.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }

  createEvent(): void {
    if (!this.form.valid) {
      return;
    }
    const newEvent = this.form.value;
    this.eventService.create(newEvent).subscribe(() => {
      this.eventService.onCreate();
      this.router.navigateByUrl(`/events`);
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(`/events`);
  }
}
