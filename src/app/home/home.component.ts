import { Component } from '@angular/core';

import { ClipsListComponent } from '../clips-list/clips-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ClipsListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
