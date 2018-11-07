import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '@items/models/item';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})
export class PollsComponent implements OnInit {
  @Input() item: Item;
  @Output() options = new EventEmitter();
  polls = {};
  statuses = {
    open: 'open',
    closed: 'closed',
    voted: 'voted'
  };

  myVote: string;

  constructor() { }

  ngOnInit() {
  }

}
