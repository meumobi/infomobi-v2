import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Comment } from '@comments/models/comment';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService implements OnInit {

  private commentsRef: AngularFirestoreCollection<Comment>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.commentsRef = this.afs.collection<Comment>('comments');
  }

  ngOnInit() {}

  delete(id: string) {
    return this.commentsRef.doc(id).delete();
  }

  promote(comment: Comment) {
    comment.channel = 'live';
    delete comment.id;
    return this.create(comment);
  }

  create(props: Comment) {
    const id = this.afs.createId();
    const comment: Comment = { id, ...props };
    return this.commentsRef.doc(id).set(comment);
  }

  update(comment: Comment) {

    return this.commentsRef.doc(comment.id).set(comment);
  }
}
