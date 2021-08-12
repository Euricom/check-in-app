import { UserService } from './../shared/services/user.service';
import { AuthService } from './../shared/services/auth.service';
import { EventService } from './../shared/services/event.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Event } from '../shared/models/event.model';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {
  clickEventSubscription: Subscription;
  events = Array<Event>();
  user: User;
  isAdmin = false;
  loading = true;
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService,
    private userSevice: UserService
  ) {
    this.clickEventSubscription = this.eventService
      .getCreateEvent()
      .subscribe(() => {
        this.getEvents();
      });
  }

  async ngOnInit() {
    this.loading = true;
    this.user = await this.authService.getOrCreateUser();
    this.isAdmin = this.authService.isAdmin;
    this.getEvents();
  }

  getEvents() {
    return this.eventService
      .getAll(this.user ? this.user._id : '-')
      .subscribe((res) => {
        this.loading = false;
        this.events = res;
      });
  }

  doRefresh(e) {
    this.getEvents().add(() => {
      e.target.complete();
    });
  }

  goDetail(id): void {
    this.router.navigate(['event', id]);
  }

  onEdit(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  onDelete(id): void {
    this.events = this.events.filter((item) => id !== item.eventId);
    this.eventService.delete(id).subscribe();
  }

  createEvent(): void {
    this.router.navigateByUrl('/events/new');
  }

  onCheckEvent(item) {
    item.subscribed = !item.subscribed;
    this.userSevice
      .updateUser(this.user._id, {
        item,
        data: { field: 'updateSubscribed' },
      })
      .subscribe(() => {
        this.getEvents();
      });
  }

  ngOnDestroy(): void {
    this.clickEventSubscription.unsubscribe();
  }
}
