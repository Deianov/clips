import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  videoOrder = 1;

  ngOnInit(): void {
    // this.route.data.subscribe(console.log);
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? 2 : 1;
    });
  }

  // todo: the select component change navigation's active status ?
  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
}
