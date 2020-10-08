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
  newEvent = {};
  createdEvent = {};
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
    console.log('submitted form');
    console.log(this.form);
    this.newEvent = this.form.value;
    this.eventService.create(this.newEvent).subscribe((res: any) => {
      if (res && res.eventId) {
        this.router.navigateByUrl(`/event/${res.eventId}`);
      }
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
