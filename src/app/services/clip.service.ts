import { deleteObject, getStorage, ref } from 'firebase/storage';
import {
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

// import { AngularFireStorage } from '@angular/fire/compat/storage';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private readonly db = inject(AngularFirestore);
  private readonly auth = inject(AngularFireAuth);
  private readonly router = inject(Router);
  // private readonly storage = inject(AngularFireStorage);

  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingReg = false;

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
    const screenshotRef = ref(
      storage,
      `screenshots/${clip.screenshotFileName}`
    );

    await deleteObject(clipRef);
    await deleteObject(screenshotRef);

    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {
    if (this.pendingReg) {
      return;
    }
    this.pendingReg = true;

    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);

    const { length } = this.pageClips;

    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await lastValueFrom(
        this.clipsCollection.doc(lastDocID).get()
      );

      console.log(lastDoc);

      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    snapshot.forEach((doc) => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(),
      });
    });

    this.pendingReg = false;
  }

  resolve(id: string): Observable<IClip | null> {
    return this.clipsCollection
      .doc(id)
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();

          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      );
  }
}
