import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnDestroy, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import type { Item } from '../../types';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, CommonModule, MatSortModule, MatPaginatorModule]
})
export class TableComponent implements AfterViewInit, OnDestroy {
  subs = new Subscription();
  columns = ["color", "name", "created_at", "updated_at"]
  data = input.required<Item[]>();
  count = input.required<number>();
  query = input.required<string>();
  pageSize = input.required<number>();

  pageSizeOptions = [10, 20, 30, 40, 50];

  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  sortChanges = output<Sort>();
  pageChanges = output<PageEvent>();

  editItem = output<Item>();

  ngAfterViewInit(): void {
    this.subs.add(
      this.sort()?.sortChange.subscribe({
        next: (changes: Sort) => {
          this.sortChanges.emit(changes);
        }
      })
    );

    this.subs.add(
      this.paginator()?.page.subscribe({
        next: (ev: PageEvent) => {
          this.pageChanges.emit(ev);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
