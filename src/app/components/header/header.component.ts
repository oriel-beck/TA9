import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Subscription } from 'rxjs';

import { Views } from '../../enums';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly subs = new Subscription();

  query = input<string>("");
  view = input<Views>(Views.Table);

  changeView = output<Views>();
  addNewItem = output();
  search = output<string>();

  queryControl = new FormControl(this.query());

  startSearch(ev: Event) {
    this.search.emit((ev.target as HTMLInputElement).value);
  }

  ngOnInit(): void {
    this.subs.add(
      this.queryControl.valueChanges.subscribe({
        next: (v) => this.search.emit(v || "")
      })
    );
  }

  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
