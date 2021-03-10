import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  modalCtrl;
  title = 'Add Users';
  users: Array<any>;
  @Input() eventId: string;

  constructor(
    public modalController: ModalController,
    private userSevice: UserService
  ) {}

  ngOnInit() {
    this.getUsers();
    console.log(this.eventId);
  }

  onChecked(user) {
    console.log(user);
    console.table(this.users);
  }

  onCancel(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
    // this.eventService.onNovigateToOverview();
  }

  getUsers() {
    this.userSevice.getAll().subscribe((res) => {
      this.fiterSubscribedUsers(res);
    });
  }

  fiterSubscribedUsers(users) {
    const unSubscribedUsers = users.filter(
      (user) =>
        user.subscribed.find((event) => event.id === this.eventId) === undefined
    );
    const subscribedUsers = users
      .filter(
        (user) =>
          user.subscribed.find((event) => event.id === this.eventId) !==
          undefined
      )
      .map((user) => {
        return { ...user, disabled: true };
      });

    this.users = [...unSubscribedUsers, ...subscribedUsers];
  }

  onAdd(): void {
    const usersToAdd = this.users.filter((user) => user.toAdd === true);
    this.modalController.dismiss({
      dismissed: true,
      addedUsers: usersToAdd,
    });
  }
}
