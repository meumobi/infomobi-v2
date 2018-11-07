import { Router } from '@angular/router';
import { Item } from '@items/models/item';
import { Component, OnInit } from '@angular/core';
import { ItemsService } from '@items/services/items.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  items: Item[];

  constructor(
    private itemsService: ItemsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.itemsService.latest().then(
      data => {
        console.log('fetch items');
        console.log(data);
        this.items = data;
      }
    );
  }

  openItem(item: Item) {
    this.itemsService.setCurrentItem(item);
    this.router.navigateByUrl('/tabs/(items:items/detail/)');
  }
}
