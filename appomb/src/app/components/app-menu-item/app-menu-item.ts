import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Page } from '../../shared/interfaces';

@Component({
  selector: 'app-menu-item',
  templateUrl: './app-menu-item.html',
  styleUrl: './app-menu-item.scss'
})
export class AppMenuItemComponent {
  @Output() pageSelected: EventEmitter<Page> = new EventEmitter<Page>();
  @Input() pages: Page[] = [];

  constructor() {
  }

  openPage(page: Page) {
    this.pageSelected.emit(page);
  }

}
