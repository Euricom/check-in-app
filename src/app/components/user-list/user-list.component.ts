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
      this.users = res;
      this.fiterSubscribedUsers();
    });
  }

  fiterSubscribedUsers(): Array<User> {
    const filteredUsers = this.users.filter((user) =>
      user.subscriptions.find((event) => event.id === this.eventId)
    );
    return filteredUsers;
  }

  onAdd(): void {}
}
