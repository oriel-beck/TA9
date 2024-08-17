import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Item } from '../../types';

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class GridComponent {
  items = input.required<Item[]>();

  editItem = output<Item>();
}
