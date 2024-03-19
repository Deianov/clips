import firebase from 'firebase/compat/app';
import { combineLatest, forkJoin, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { NgClass, PercentPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EventBlockerDirective } from '@directives/event-blocker.directive';
import { AlertComponent } from '@shared/alert/alert.component';
import { InputComponent } from '@shared/input/input.component';

import { ClipService } from '../../services/clip.service';
import { FfmpegService } from '../../services/ffmpeg.service';
import { SafeURLPipe } from '../pipes/safe-url.pipe';

const MSG_ALERT_WAITING = 'Pleas wait Your clip is being uploaded.';
const MSG_ALERT_SUCCESS = 'Success! Your clip is now ready.';
const MSG_ALERT_FAILED = 'Upload failed! Please try again later.';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputComponent,
    EventBlockerDirective,
    AlertComponent,
    PercentPipe,
    SafeURLPipe,
  ],
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnDestroy {
  private readonly storage = inject(AngularFireStorage);
  private readonly auth = inject(AngularFireAuth);
  private readonly clipService = inject(ClipService);
  private readonly router = inject(Router);
  public readonly ffmpegService = inject(FfmpegService);

  isDragover = false;
  file: File | null = null;
  nestStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = '';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor() {
    this.auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }

    this.isDragover = false;

    const data =
      ($event as DragEvent).dataTransfer ?? ($event.target as HTMLInputElement);

    this.file = data.files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nestStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = MSG_ALERT_WAITING;
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask?.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) {
        return;
      }

      const total = clipProgress + screenshotProgress;

      this.percentage = (total as number) / 200;
    });

    const clipRef = this.storage.ref(clipPath);

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;

          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url: clipURL,
            screenshotURL,
            screenshotFileName: `${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = MSG_ALERT_SUCCESS;
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();

          this.alertColor = 'red';
          this.alertMsg = MSG_ALERT_FAILED;
          this.inSubmission = true;
          this.showPercentage = false;
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    // Cancel the upload if the user leaves the page while uploading
    this.task?.cancel();
  }
}
