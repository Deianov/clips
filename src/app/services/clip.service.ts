import { deleteObject, getStorage, ref } from 'firebase/storage';
import { BehaviorSubject, combineLatest, map, of, OperatorFunction, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentReference,
	QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { ClipComponent } from '../clip/clip.component';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private readonly db = inject(AngularFirestore);
  private readonly auth = inject(AngularFireAuth);
  // private readonly storage = inject(AngularFireStorage);

  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor() {
    this.clipsCollection = this.db.collection('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;

        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title,
    });
  }

  async deleteClip(clip: IClip) {
    // const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    // clipRef.delete();

    const storage = getStorage();
    const clipRef = ref(storage, `clips/${clip.fileName}`);

    await deleteObject(clipRef);

    await this.clipsCollection.doc(clip.docID).delete();
  }
}
