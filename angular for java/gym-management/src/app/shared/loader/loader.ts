import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Loaderservice } from '../service/loaderservice';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class LoaderComponent {
  private loaderService = inject(Loaderservice);

  loading$ = this.loaderService.loading$;
}
