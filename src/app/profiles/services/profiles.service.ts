import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Profile } from '@profiles/models';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private profilesCollection: AngularFirestoreCollection<Profile>
  private profiles$: Observable<Profile[]>;

  constructor(
    private afs: AngularFirestore
  ) { 
    this.profilesCollection = afs.collection<Profile>('profiles');
    this.profiles$ = this.profilesCollection.valueChanges();
  }

  create(props: Profile) {
    // Persist a document id
    const id = this.afs.createId();
    const profile: Profile = { id, ...props };
    return this.profilesCollection.doc(id).set(profile);
  }

  update(props: Profile) {
    return this.profilesCollection.doc(props.id).update(props);
  }

  delete(id: string) {
    return this.profilesCollection.doc(id).delete();
  }

  fetchAll() {
    return this.profiles$;
  }

  fecthById(id: string) {
    return this.profilesCollection.doc<Profile>(id).valueChanges();
  }
}
