import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() comment: Comment;
  @Output() options = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
}
