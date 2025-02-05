import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, ModalController } from '@ionic/angular';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../providers/product.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { AdminStoreService } from '../../providers/admin-store.service';
import { EventService } from 'src/app/providers/event.service';

class ProductItem {
  product: Product;
  active: boolean;
}

@Component({
  selector: 'app-edit-product-actives',
  templateUrl: './edit-product-actives.html',
  styleUrl: './edit-product-actives.scss',
})
export class EditProductActivesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  productItems: ProductItem[] = [];
  products: Product[] = [];
  searchText: string = '';

  constructor(
    private modalCtrl: ModalController,
    private trans: TranslateService,
    private alertHelper: AlertHelper,
    private renderer: Renderer2,
    private events: EventService,
    private adminStoreService: AdminStoreService,
    protected loadingHelper: LoadingHelper,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadingHelper.setLoading('list', true);
    this.init();

    // Foco no campo de busca após a inicialização
    setTimeout(() => this.searchBar?.setFocus(), 500);
  }

  // Inicializa a lista de produtos
  init() {
    this.productService
      .list({ without_reseller: true, category: 0 })
      .toPromise()
      .then((res) => {
        this.products = res;
        this.parse();
      })
      .catch(this.handlerError.bind(this));
  }

  // Parseia os dados de produtos para a estrutura esperada
  parse() {
    const activatedItems = this.products
      .filter((product) => product.is_visible)
      .map((product) => product.id);

    this.productItems = this.products.map((product) => ({
      product,
      active: activatedItems.includes(product.id),
    }));

    this.loadingHelper.setLoading('list', false);
  }

  // Obtém os produtos ativos
  getActivatedItems() {
    return this.productItems
      .filter((item) => item.active)
      .map((item) => ({ id: item.product.id }));
  }

  // Alterna o estado ativo de um produto
  toggleActive(event: Event, item: ProductItem) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('no-click')) {
      return;
    }
    item.active = !item.active;
  }

  // Fecha o modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Salva as alterações
  saveChanges() {
    this.loadingHelper.show();

    this.adminStoreService
      .changeProductsVisibles({ products: this.getActivatedItems() })
      .toPromise()
      .then(() => {
        this.loadingHelper.hide();
        this.events.emitEvent('productsListEdited');
        this.dismiss();
      })
      .catch(this.handlerError.bind(this));
  }

  // Manipula erros
  handlerError(error: any) {
    console.error(error);
    this.dismiss();
    this.loadingHelper.hide();
    this.trans.get('ERROR_REQUEST').subscribe((val) => {
      this.alertHelper.show(val);
    });
  }

  onInput(e) {
  }
}
