import { Directive, HostListener } from '@angular/core';

@Directive({
  // change: CamelCase to lower case separated by hyphens/dash (Kebab-case)
  selector: '[app-event-blocker]',
  standalone: true,
})
export class EventBlockerDirective {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault();
  }
}
