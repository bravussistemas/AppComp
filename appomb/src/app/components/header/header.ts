import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AppConfig } from '../../../configs';
import { FIRST_PAGE_APP } from '../../shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'], // Correção aqui
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/* eslint-disable @angular-eslint/component-class-suffix */
export class Header {
  @Input() title: string = this.appConfig.APP_NAME;
  @Input() subTitle?: string;
  @Input() iconClass?: string;
  @Input() buttonIcon?: string;
  @Input() titleCaps: boolean = this.appConfig.HEADER_UPPERCASE_DEFAULT_VALUE;
  @Input() centerTitle: boolean = false;
  @Output() headerBtnClick: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private router: Router, private appConfig: AppConfig) {}

  btnClick(event: Event): void {
    this.headerBtnClick.emit(event); // Evento emitido
  }

  headerClicked(): void {
    this.router.navigate([FIRST_PAGE_APP]); // Navega para a página inicial
  }
}
