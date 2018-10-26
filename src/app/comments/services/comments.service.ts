import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Comment } from '../models/comment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Query } from '@firebase/firestore-types';
import { switchMap, map, scan, concat } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private _filters$ = new Subject<Object>();
  private filters$;
  private comments$: Observable<Comment[]>;
  private commentsCollection: AngularFirestoreCollection<Comment>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.filters$ = this._filters$.pipe(
      scan((acc, curr) => Object.assign({}, acc, curr), {})
    );
    this.comments$ = this.filters$.pipe(
      switchMap(
        filters => {
          this.commentsCollection = this.afs.collection<Comment>('comments',
          ref => {
            console.log(filters);
            let query: Query = ref;
            query = query.where('isPublished', '==', filters['isPublished']);
            query = query.where('channel', '==', filters['channel']);
            query = query.orderBy('published', 'desc');
            query = query.limit(10);
            return query;
          });
          return this.commentsCollection.valueChanges();
        }
      )
    );
  }

  setFilters(filters): void {
    this._filters$.next(filters);
  }

  delete(id: string) {
    return this.commentsCollection.doc(id).delete();
  }

  create(props: Comment) {
    const id = this.afs.createId();
    const profile: Comment = { id, ...props };
    return this.commentsCollection.doc(id).set(profile);
  }

  fetch() {
    return this.comments$;
  }

}
