import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  title = 'Add Users';
  users: Array<any>;
  allSubscribed = false;
  loading = true;
  searchText = '';
  @Input() eventId: string;

  constructor(
    public modalController: ModalController,
    private userSevice: UserService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userSevice.getAll().subscribe((res) => {
      this.fiterSubscribedUsers(res);
      this.loading = false;
    });
  }

  setCheckAll(event) {
    this.users.forEach((user) => (user.toAdd = event.detail.checked));
    console.log(this.users);
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

    if (unSubscribedUsers.length === 0) {
      this.allSubscribed = true;
    }

    this.users = [...unSubscribedUsers, ...subscribedUsers];
  }

  onAdd(): void {
    const usersToAdd = this.users.filter((user) => user.toAdd === true);
    console.log(usersToAdd);

    this.modalController.dismiss({
      dismissed: true,
      addedUsers: usersToAdd,
    });
  }

  onCancel(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
