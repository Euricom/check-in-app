import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      eventName: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }

  createEvent(): void {
    console.log('submitted form');
    console.log(this.form);
  }

  onCancel(): void {
    this.router.navigateByUrl('/events');
  }
}
