import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Product } from '../../shared/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.html'
})
export class ProductImg {

  @Input('product') product: Product;
  @Input('enableDetail') enableDetail = true;

  constructor(public navCtrl: NavController,
              public router:Router,
  ) {
  }

  goToDetail() {
    if (this.enableDetail) {
      this.router.navigate(['/DetailProduct', {product: this.product}]);
    }
  }

  parseThumbUrl(url: string) {
    if (url) {
      return url;
    }
  }
}
