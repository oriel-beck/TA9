import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { MatSidenavModule } from '@angular/material/sidenav';
import { TableComponent } from "./components/table/table.component";
import { GridComponent } from "./components/grid/grid.component";
import { NewSidebarComponent } from "./components/new-sidebar/new-sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { ItemsStore } from './store/items.store';
import type { Item } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TableComponent,
    GridComponent,
    NewSidebarComponent,
    MatSidenavModule,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ItemsStore]
})
export class AppComponent {
  readonly store = inject(ItemsStore);
  readonly items = this.store.items();
  private readonly registry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  sidebar = viewChild(NewSidebarComponent);

  constructor() {
    this.registry.addSvgIcon("grid_view", this.domSanitizer.bypassSecurityTrustResourceUrl("/grid_view.svg"))
  }

  closeSidebar(item?: Partial<Item> | null) {
    if (item) item._index != null ? this.store.editItem(item._index, item) : this.store.addItem(item);
    this.sidebar()?.close();
  }
}
