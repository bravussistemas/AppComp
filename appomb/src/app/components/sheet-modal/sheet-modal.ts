import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'sheet-modal',
  templateUrl: 'sheet-modal.html',
  animations: [
    trigger('cardState', [
      state('open', style({height: '*'})),
      state('close', style({height: '45px'})),
      transition('open <=> close', animate('250ms ease-in'))
    ]),

    trigger('overlayState', [
      state('open', style({opacity: '*'})),
      state('close', style({opacity: '0', display: 'none'})),
      transition('open <=> close', animate('250ms ease-in'))
    ])
  ]
})
export class SheetModalComponent {
  private _state = 'close';

  get state(): string {
    return this._state;
  }

  @Input()
  set state(value: string) {
    this._state = value;
    if (value === 'open') {
      this.onOpen.emit();
    }
  }

  @Input() modalTitle: string;
  @Output() onOpen = new EventEmitter();
  @ViewChild('shmBody') shmBody: ElementRef;
  @ViewChild('shmWrapper') shmWrapper: ElementRef;
  @ViewChild('shmHeader') shmHeader: ElementRef;

  realCurrentState = this._state;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
    setTimeout(() => {
      const modalHeight = this.shmWrapper.nativeElement.offsetHeight;
      const headerHeight = this.shmHeader.nativeElement.offsetHeight;
      const bodyHeight = modalHeight - headerHeight - 20;
      this.renderer.setStyle(this.shmBody.nativeElement, 'height', bodyHeight + 'px');
    });
    setTimeout(() => {
      this.state = 'close';
    }, 450);
  }

  onSwipeUp() {
    this.state = 'open';
  }

  onSwipeDown() {
    this.state = 'close';
  }

  toggle() {
    this.state = (this.state === 'close') ? 'open' : 'close';
  }

  onScroll(e) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  handleAnimDone(e) {
    this.realCurrentState = e.toState;
  }

  closeTimeout;

  onSwipeDownBody() {
    this.closeTimeout = setTimeout(() => {
      if (this.shmBody.nativeElement.scrollTop === 0 && this.realCurrentState === 'open') {
        this.state = 'close';
      }
    }, 150);
  }

}
