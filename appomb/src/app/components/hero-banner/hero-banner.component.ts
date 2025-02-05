import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroBannerComponent implements OnInit {
  @Input() src: string;

  get url(): string {
    return `url("${this.src}")`;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
