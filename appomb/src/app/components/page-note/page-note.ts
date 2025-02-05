import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-note',
  templateUrl: './page-note.html',
  styleUrl: './page-note.scss'
})
export class PageNoteComponent implements OnInit {

  @Input('title') title: string;
  @Input('text') text: string;
  @Input() autoShow = false;

  closed = true;

  close() {
    this.closed = true;
  }

  show() {
    this.closed = false;
  }

  constructor() {
  }

  ngOnInit() {
    if (this.autoShow) {
      this.closed = false;
    }
  }

}
