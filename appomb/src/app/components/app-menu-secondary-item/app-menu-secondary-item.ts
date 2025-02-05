import { Component, Input } from '@angular/core';
import { SecondaryMenu } from '../../shared/interfaces';

@Component({
  selector: 'app-menu-secondary-item',
  templateUrl: './app-menu-secondary-item.html',
  styleUrl: './app-menu-secondary-item.scss'
})
export class AppMenuSecondaryItemComponent {
  @Input() items: SecondaryMenu[] = [];

  constructor() {
  }

}
