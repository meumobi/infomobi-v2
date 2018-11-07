import { Item } from '@items/models/item';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private currentItem: Item;

  constructor(
    private apiService: ApiService
  ) {
    console.log('Constructor ItemsService');
  }

  latest(): Promise<Item[]> {

    return this.apiService.fetchLatestItems()
    .then(
      (res: any) => {
        return res;
      }
    );
  }

  setCurrentItem(item: Item): void {
    this.currentItem = item;
  }

  getCurrentItem(): Item {

    return this.currentItem;
  }
}
