import { Query } from '@firebase/firestore-types';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ItemsService } from '@items/services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '@items/models/item';
import { Comment } from '@comments/models/comment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentsService } from '@comments/services/comments.service';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {
  public comments$: Observable<Comment[]>;
  private commentsRef: AngularFirestoreCollection<Comment>;
  public item: Item;

  constructor(
    private commentsService: CommentsService,
    private router: Router,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private afs: AngularFirestore,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.item = this.itemsService.getCurrentItem();
    this.commentsRef = this.afs.collection<Comment>('comments',
      ref => {
        let query: Query = ref;
        query = query.where('isPublished', '==', true);
        query = query.where('channel', '==', `item_${this.item._id}`);
        query = query.orderBy('published', 'desc');
        query = query.limit(20);
        return query;
      }
    );
    // this.id = this.route.snapshot.paramMap.get('id');
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

  loadComments() {
    this.comments$ = this.commentsRef.valueChanges();
  }

  openPage(url: string) {
    this.router.navigateByUrl(url);
  }
}
