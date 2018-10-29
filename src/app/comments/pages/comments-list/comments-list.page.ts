import { switchMap } from 'rxjs/operators';
import { Comment } from '@comments/models/comment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommentsService } from 'app/comments/services/comments.service';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Query } from '@firebase/firestore-types';


@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.page.html',
  styleUrls: ['./comments-list.page.scss'],
})
export class CommentsListPage implements OnInit {
  private isPublishedFilter$: BehaviorSubject<boolean>;
  private channelFilter$: BehaviorSubject<string>;
  private comments$: Observable<Comment[]>;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private commentsService: CommentsService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
  ) {
    this.isPublishedFilter$ = new BehaviorSubject(true);
    this.channelFilter$ = new BehaviorSubject('live');
  }

  ngOnInit() {
    this.comments$ = combineLatest(
      this.isPublishedFilter$,
      this.channelFilter$
    ).pipe(
      switchMap(([isPublished, channel]) => {
        return this.afs.collection<Comment>('comments',
          ref => {
            let query: Query = ref;
            query = query.where('isPublished', '==', isPublished);
            query = query.where('channel', '==', channel);
            query = query.orderBy('published', 'desc');
            query = query.limit(20);
            return query;
          }
        ).valueChanges();
      })
    );
  }

  openPage(url: string) {
    this.router.navigateByUrl(url);
  }

  toggleisPublished() {
    this.isPublishedFilter$.next(!this.isPublishedFilter$.getValue());
  }

  async delete(id) {
    const loading = await this.loadingController.create({
      message: 'Deleting Comment..'
    });
    await loading.present();
    this.commentsService.delete(id).then(() => {
      loading.dismiss();
    });
  }

  async promote(id) {
    const loading = await this.loadingController.create({
      message: 'Promoting Comment..'
    });
    await loading.present();
    this.commentsService.promote(id).then(() => {
      loading.dismiss();
    });
  }

  async openOptions(comment) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.delete(comment.id);
        }
      }, {
        text: comment.isPublished ? 'Unpublish' : 'Publish',
        icon: comment.isPublished ? 'eye-off' : 'eye',
        role: 'cancel',
        handler: () => {
          comment.isPublished = !comment.isPublished;
          this.commentsService.update(comment);
        }
      }, {
        text: 'Promote',
        role: 'destructive',
        icon: 'trophy',
        handler: () => {
          this.promote(comment);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
