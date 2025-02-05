import { Directive, HostListener, Input } from '@angular/core';
import { ToastHelper, MyToastOptions } from '../../utils/toast-helper';

@Directive({
  selector: '[tip-on-tap]' // Attribute selector
})
export class TipOnTap {
  @Input('message') message: string;
  @Input('position') position:  'top' | 'bottom' | 'middle';
  @Input('duration') duration: number;

  constructor(private toastHelper: ToastHelper) {
  }

  @HostListener('click')
  onClick() {
    this.showToast();
  }

  private showToast() {
    if (this.message) {
      this.position = this.position || 'middle';
      this.toastHelper.show({
        message: this.message,
        duration: this.duration,
        position: this.position,
        cssClass: 'toast-custom-white'
      });
    }
  }
}
