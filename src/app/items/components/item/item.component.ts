import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChild
} from '@angular/core';
import { Item } from '@items/models/item';
import * as types from '../types';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @ViewChild('element', { read: ViewContainerRef }) entry: ViewContainerRef;
  @Output() options = new EventEmitter();
  componentRef: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {  }

  ngOnInit() {
    this.loadComponent();
  }

  getComponentName(name: string) {
    return name.charAt(0).toUpperCase() + name.substr(1) + 'Component';
  }


  loadComponent() {
    this.entry.clear();
    if (!this.item.type) {
      this.item['type'] = 'Articles';
    }
    const className = this.getComponentName(this.item.type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(types[className]);
    this.componentRef = this.entry.createComponent(componentFactory, this.entry.length, null);
    (this.componentRef.instance).item = this.item;
    (this.componentRef.instance).options.subscribe(
    data => {
      this.options.emit(data);
    });
  }
}
