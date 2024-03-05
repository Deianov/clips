import { Routes } from '@angular/router';

import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

export const MANAGE_ROUTES: Routes = [
  {
    path: '',
    component: ManageComponent,
    data: {
      authOnly: true,
    },

    // children: [
    //   {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'upload',
    //   },
    //   {
    //     path: 'upload',
    //     component: UploadComponent,
    //   },
    // ],
  },
];

export const UPLOAD_ROUTES: Routes = [
  {
    path: '',
    component: UploadComponent,
    data: {
      authOnly: true,
    },
  },
];
