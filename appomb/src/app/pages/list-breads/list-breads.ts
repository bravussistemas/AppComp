import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Product } from '../../shared/models/product.model';
import { Store } from '../../shared/models/store.model';
import { ProductService } from '../../providers/product.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { SettingsService } from '../../providers/settings-service';
import { TranslateService } from '@ngx-translate/core';
import { AlertHelper } from '../../utils/alert-helper';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { AdminStoreService, ChangeOrderDTO } from '../../providers/admin-store.service';
import { ToastHelper } from '../../utils/toast-helper';
import * as Raven from 'raven-js';
import { IUserSettings } from '../../shared/interfaces';
import { EventService } from 'src/app/providers/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EditProductActivesPage } from '../edit-product-actives/edit-product-actives';

export let parseProductsToReorder = (items: Product[]): ChangeOrderDTO[] => {
  return items.map((item) => {
    return {id: item.id, item_order: items.indexOf(item)}
  })
};
const MSG_ID = '0934127u4895';

@Component({
  selector: 'page-list-breads',
  templateUrl: './list-breads.html',
  styleUrl: './list-breads.scss',
})
export class ListBreadsPage implements OnInit, OnDestroy {
  products: Product[] = [];
  store: Store;
  searchText: string;
  canShowMsg: boolean;
  enableSearch: boolean = false;
  isAdmin = false;
  reorder = false;
  @ViewChild(IonContent) content: IonContent;

  constructor(public router: Router,
              private modalCtrl: ModalController,
              private settingsService: SettingsService,
              public productService: ProductService,
              private adminStoreService: AdminStoreService,
              private trans: TranslateService,
              private events: EventService,
              private alertHelper: AlertHelper,
              public loadingHelper: LoadingHelper,
              private toastHelper: ToastHelper,
              private authService: AuthService,
              private renderer: Renderer2,
              private storage: Storage,
              public route: ActivatedRoute) {
  }

  eventProductsListEdited = () => {
    this.getProducts();
  };

  init() {
    this.events.onEvent('productsListEdited').subscribe(this.eventProductsListEdited);
    this.getProducts();
  }

  getProducts() {
    this.loadingHelper.setLoading('products', true);
    this.productService.listBreads().toPromise()
      .then((res) => {
        this.products = res;
        this.loadingHelper.setLoading('products', false);
      })
      .catch(this.handlerError.bind(this));
  }

  hideMsg() {
    this.storage.set(MSG_ID, new Date().toJSON()).then(() => {
      this.canShowMsg = false;
    });
  }

  handlerError(error) {
    console.error(error);
    this.loadingHelper.hide();
    this.trans.get('ERROR_REQUEST').subscribe((val) => {
      this.alertHelper.show(val);
    });
  }

  async startSearch() {
    const contentElement = await this.content.getScrollElement();
    this.renderer.addClass(contentElement, 'content-with-fixed-toolbar-top');
    this.enableSearch = true;
  }
  
  async stopSearch() {
    const contentElement = await this.content.getScrollElement();
    this.renderer.removeClass(contentElement, 'content-with-fixed-toolbar-top');
    this.enableSearch = false;
    this.searchText = null;
  }

  goToDetail(product: Product) {
    this.router.navigate(['/DetailProduct'], { queryParams: { product: product } });
  }

  startReorder() {
    this.reorder = true;
    this.stopSearch();
  }

  saveReorder() {
    this.loadingHelper.show();
    this.adminStoreService.changeProductsOrder(parseProductsToReorder(this.products))
      .subscribe(() => {
        this.loadingHelper.hide();
        this.toastHelper.show({message: 'Ordem alterada com sucesso', cssClass: 'toast-success'});
        this.reorder = false;
      }, () => {
        this.loadingHelper.hide();
        this.trans.get(['ERROR', 'ERROR_REQUEST']).subscribe((res: any) => {
          this.alertHelper.show(res.ERROR, res.ERROR_REQUEST);
        });
      });
  }
  
  reorderItems(event: any) {
    // Atualize a ordem do array com os índices fornecidos pelo evento
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;
    const movedItem = this.products.splice(fromIndex, 1)[0];
    this.products.splice(toIndex, 0, movedItem);

    // Finalize a interação
    event.detail.complete();
  }
  // reorderItems(indexes) {
  //   this.products = reorderArray(this.products, indexes);
  // }

  cancelReorder() {
    this.trans.get(['CANCEL', 'CANCEL_REORDER']).subscribe((val) => {
      this.alertHelper.confirm(
        val.CANCEL,
        val.CANCEL_REORDER,
      ).then((isConfirmed) => {
        if (isConfirmed) {
          this.reorder = false;
        }
      });
    });
  }
  
  async openEditProductsModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: EditProductActivesPage,
      });  
      await modal.present(); 
    } catch (error) {
      Raven.captureException(error);
    }
  }

  ngOnInit(): void {
    this.loadingHelper.setLoading('list', true);

    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.init();
      }).catch(this.handlerError.bind(this));

    this.storage.get(MSG_ID).then((resp) => {
      this.canShowMsg = resp === null;
    });

    this.authService.isAdmin().then((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('productsListEdited');
  }
}
