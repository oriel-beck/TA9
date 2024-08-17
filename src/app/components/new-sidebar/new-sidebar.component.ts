import { ChangeDetectionStrategy, Component, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import type { Item } from '../../types';

@Component({
  selector: 'app-new-sidebar',
  standalone: true,
  templateUrl: './new-sidebar.component.html',
  styleUrl: './new-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ]
})
export class NewSidebarComponent {
  itemForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl(""),
    color: new FormControl("#000000"),
    _index: new FormControl<number | null>(null)
  });;

  save = output<Partial<Item> | null>();

  sidenav = viewChild(MatSidenav);

  open(item?: Item) {
    if (item) this.itemForm.setValue({
      name: item.name,
      description: item.description,
      color: item.color,
      _index: item._index
    });

    this.sidenav()?.open();
  }

  close() {
    this.sidenav()?.close();
    this.itemForm.markAsPristine();
    this.itemForm.reset({
      color: "#000000"
    });
  }

  onClose(bool: boolean) {
    if (!bool) this.save.emit(null);
    else this.save.emit(this.itemForm.value as Partial<Item>);
  }
}
