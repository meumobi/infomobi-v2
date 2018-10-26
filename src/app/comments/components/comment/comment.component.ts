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
import { Comment } from '@comments/models/comment';
import * as types from '../types';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
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
    if (!this.comment.type) {
      this.comment['type'] = 'Message';
    }
    const className = this.getComponentName(this.comment.type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(types[className]);
    this.componentRef = this.entry.createComponent(componentFactory, this.entry.length, null);
    (this.componentRef.instance).comment = this.comment;
    (this.componentRef.instance).options.subscribe(
      data => {
        this.options.emit(data);
      });
  }
}
