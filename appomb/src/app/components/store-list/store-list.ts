import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '../../shared/models/store.model';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.html',
  styleUrls: ['./store-list.scss'],
})
export class StoreListComponent {
  @Output() chooseStore: EventEmitter<Store> = new EventEmitter<Store>();

  @Input() stores: Store[];
  @Input() title: string;
  @Input() reordering: boolean;
  defaultThumb: string = 'assets/img/logo.png';

  constructor() {}

  reorderItems(event: any): void {
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;

    if (this.stores) {
      const movedItem = this.stores.splice(fromIndex, 1)[0];
      this.stores.splice(toIndex, 0, movedItem);
    }

    event.detail.complete();
  }

  onChoose(store: Store) {
    if (this.reordering) return;
    this.chooseStore.emit(store);
  }
}
