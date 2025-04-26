import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMask]',
})
export class MaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const input = this.el.nativeElement;
    let value = input.value;

    if (input.id === 'inputCardHolderId') {
      value = value.replace(/\D/g, ''); 
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }

    // Máscara de Expiração (MM/AA)
    if (input.id === 'inputExpiration') {
      value = value.replace(/\D/g, ''); 
      if (value.length <= 4) {
        value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
      }
    }

    input.value = value;
  }
}
