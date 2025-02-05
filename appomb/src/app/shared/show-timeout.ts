import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[showTimeout]',
})
export class ShowTimeout {

  get showTimeout(): number {
    return this._showTimeout;
  }

  @Input()
  set showTimeout(value: number) {
    this._showTimeout = value;
    if (!this.started) {
      this.started = true;
      this.startTimeout(value);
    }
  }

  startTimeout(showTimeout) {
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'hidden');
    }, showTimeout);
  }

  private _showTimeout: number = 500;
  started = false;

  constructor(public el: ElementRef, public renderer: Renderer2) {
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'hidden');
  }

}
