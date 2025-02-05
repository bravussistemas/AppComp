import { Component, Input } from '@angular/core';
import { BrandUtils } from "../../utils/brands-utils";

@Component({
  selector: 'brand-icon',
  templateUrl: 'brand-icon.html'
})
export class BrandIconComponent {
  get brandId() {
    return this._brandId;
  }

  @Input('brandId') set brandId(value: number) {
    this._brandId = value;
    this.brandCls = BrandUtils.toCssClass(value);
  }

  private _brandId: number;
  protected brandCls: string;

  constructor() {
  }

}
