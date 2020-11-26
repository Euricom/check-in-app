import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pop-over-list',
  templateUrl: './pop-over-list.component.html',
  styleUrls: ['./pop-over-list.component.scss'],
})
export class PopOverListComponent implements OnInit {
  popover: any;
  constructor() {}
  @Input() listItems: Array<any>;
  @Output() listItemClick = new EventEmitter<any>();

  ngOnInit() {}

  public listItemClicked(option) {
    this.popover.dismiss(option);
  }
}
