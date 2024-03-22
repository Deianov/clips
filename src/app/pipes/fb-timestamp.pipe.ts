import firebase from 'firebase/compat/app';

import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fbTimestamp',
  standalone: true,
})
export class FbTimestampPipe implements PipeTransform {
  // The DatePipe must be imported into the component as a provider.
  private readonly datePipe = inject(DatePipe);

  transform(value: firebase.firestore.FieldValue | undefined) {
    if (!value) {
      return '';
    }
    const date = (value as firebase.firestore.Timestamp).toDate();
    return this.datePipe.transform(date, 'mediumDate');
  }
}
