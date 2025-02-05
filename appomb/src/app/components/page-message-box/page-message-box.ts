import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-message-box',
  templateUrl: './page-message-box.html',
  styleUrl: './page-message-box.scss'
})
export class PageMessageBox {

  @Input('text') text: string;

  constructor() {
  }

}
