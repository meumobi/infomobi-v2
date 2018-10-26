import { ItemsService } from '@items/services/items.service';
import { ActivatedRoute } from '@angular/router';
import { Item } from '@items/models/item.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: Item;

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.item = this.itemsService.getCurrentItem();

    // this.id = this.route.snapshot.paramMap.get('id');
  }
}
