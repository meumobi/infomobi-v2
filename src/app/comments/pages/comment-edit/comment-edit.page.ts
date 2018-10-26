import { Component, OnInit } from '@angular/core';
import { Message } from '@comments/models/comment';
import { NavController, LoadingController } from '@ionic/angular';
import { CommentsService } from '@comments/services/comments.service';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.page.html',
  styleUrls: ['./comment-edit.page.scss'],
})
export class CommentEditPage implements OnInit {
  comment: Message;

  constructor(
    private nav: NavController,
    private loadingController: LoadingController,
    private commentsService: CommentsService,
  ) { }

  ngOnInit() {
    this.comment = new Message();
    this.comment.author = {
      id: 'TSrA9K0dwmGO576KAkd5',
      displayName: 'Daniel Conte',
      picture: 'https://pbs.twimg.com/profile_images/993558695954079745/1KUhgjoM_400x400.jpg',
      title: 'DEV'
    };
  }

  async save() {
    const loading = await this.loadingController.create({
      message: 'Saving Comment..'
    });
    await loading.present();
    this.commentsService.create(this.comment).then(() => {
      loading.dismiss();
      this.nav.goBack();
    });
  }

}
