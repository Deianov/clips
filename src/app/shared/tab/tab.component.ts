import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
})
export class TabComponent {
  @Input() title = '';
  @Input() active = false;
}
