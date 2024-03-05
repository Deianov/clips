import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

@Component({
  selector: 'app-clip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './clip.component.html',
})
export class ClipComponent implements OnInit {
  private route = inject(ActivatedRoute);

  id = '';

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}
