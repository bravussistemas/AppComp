import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GeoServiceProvider,
  IPlaceInfoDO,
  ISearchAddressResultDO,
} from '../../providers/geo-service/geo-service';
import { Subscription } from 'rxjs';
import { LoadingHelper } from '../../utils/loading-helper';

export enum SearchAddressMode {
  PICK_ONE,
  SEARCH,
}

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.html',
  styleUrls: ['./search-address.scss'],
})
export class SearchAddressPage implements OnInit {
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchText: string = '';
  addressList: ISearchAddressResultDO[] = [];
  subGeo?: Subscription;
  searchMade: boolean = false;
  city: string = '';
  modes = SearchAddressMode;
  mode: SearchAddressMode = SearchAddressMode.SEARCH;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private geoServiceProvider: GeoServiceProvider,
    public loadingHelper: LoadingHelper
  ) {
    const params = this.route.snapshot.queryParams;
    if (params['mode']) {
      this.mode = parseInt(params['mode'], 10);
    }
    if (params['searchText']) {
      this.searchText = params['searchText'];
    }
    this.city = params['city'] || '';
  }

  ngOnInit() {
    if (this.isMode(SearchAddressMode.PICK_ONE)) {
      this.makeSearch();
    }
    setTimeout(() => {
      this.searchBar?.setFocus();
    }, 500);
  }

  isMode(mode: SearchAddressMode) {
    return this.mode === mode;
  }

  onInput(e) {
    console.debug('onInput');
    this.makeSearch();
  }

  onCancel() {}

  makeSearch() {
    this.searchMade = false;
    if (!this.searchText.trim()) {
      return;
    }
    this.loadingHelper.setLoading('addressList', true);

    this.subGeo = this.geoServiceProvider
      .searchByAddress({
        query: this.searchText,
        city: this.city,
      })
      .subscribe(
        (resp) => {
          this.searchMade = true;
          this.loadingHelper.setLoading('addressList', false);
          this.addressList = resp;
        },
        (err) => {
          this.loadingHelper.setLoading('addressList', false);
          console.error('Erro ao buscar endereços:', err);
        }
      );
  }

  selectAddress(address: ISearchAddressResultDO) {
    // this.loadingHelper.show();
    console.log(address);
    
    this.geoServiceProvider
      .getPlaceInfo({
        place_id: address.id,
        source: address.source,
      })
      .subscribe(
        (resp: IPlaceInfoDO) => {
          this.router.navigate(['HomeList'], {
            queryParams: { selectedAddress: JSON.stringify(resp) },
          });
          console.log('recebendo a resposta ', resp);
          
          this.modalCtrl.dismiss(resp);
        },
        (err) => {
          this.loadingHelper.hide();
          console.error('Erro ao obter informações do local:', err);
        }
      );
  }

  dismiss() {
    // Redirecione para a página desejada
    this.modalCtrl.dismiss();
  }
}
