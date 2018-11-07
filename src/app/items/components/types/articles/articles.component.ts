import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '@items/models/item';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  @Input() item: Item;
  @Output() options = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
