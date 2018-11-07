import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-anniversaries',
  templateUrl: './anniversaries.component.html',
  styleUrls: ['./anniversaries.component.scss']
})
export class AnniversariesComponent implements OnInit {
  @Output() options = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
