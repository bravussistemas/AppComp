import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'page-detail-product',
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.scss',
})
export class DetailProduct {
  images: string[] = [];
  product: Product;

  constructor(public router: Router, public route: ActivatedRoute) {
    this.product = JSON.parse(
      route.snapshot.paramMap.get('product')
    ) as Product;
    //O PRODUTO ESTA VINDO NULL NO PARAMETRO POR ISSO NAO EXIBE O CONTEUDO
    //VERIFICAR O POR QUE NAO ESTA VINDO
    console.log(this.product);

    if (!this.product) {
      this.router.navigate(['/HomePage']);
    } else {
      if (this.product.image && this.product.image.original) {
        this.images.push(this.product.image.original);
      }
      if (
        this.product.images_product &&
        this.product.images_product.length > 0
      ) {
        for (let i = 0; i < this.product.images_product.length; i++) {
          let img = this.product.images_product[i];
          this.images.push(img.image.original);
        }
      }
    }
  }
}
