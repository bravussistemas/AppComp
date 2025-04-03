import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBannerComponent {
  @Input() src: string;

  // get url(): string {
  //   return `url("${this.src}")`;
  // }
}
