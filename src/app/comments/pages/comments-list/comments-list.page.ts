import { Component, OnInit } from '@angular/core';
import { CommentsService } from 'app/comments/services/comments.service';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.page.html',
  styleUrls: ['./comments-list.page.scss'],
})
export class CommentsListPage implements OnInit {
  private comments;
  private newElement;
  constructor(
    private commentsService: CommentsService,
    private router: Router,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    this.commentsService.fetch()
    .subscribe(
      res => {
        this.comments = res;
        console.log(this.comments);
      }
    );
    this.commentsService.setFilters(
      {
        isPublished: true,
        channel: 'live',
        limit: 3
      }
    );
  }

  openPage(url: string) {
    this.router.navigateByUrl(url);
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

  async openOptions(id: string = '') {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.delete(id);
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
